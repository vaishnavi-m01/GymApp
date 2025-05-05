import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  BackHandler,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RadioButton } from "react-native-paper";
import ProfileMember from "./components/members/ProfileMember";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import config from "./config";

export type RootStackParamList = {
  "Member Details": { id: string; membership_id?: number | null };
};



type Member = {
  id: number;
  plan_name: string;
  plan_amount: number;
  plan_duration_days: string;
};

const AddMembership = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [plan, setPlan] = useState("One Month");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [initialAmount, setInitialAmount] = useState("");

  const [planAmount, setPlanAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);

  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);

  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [_apiCalled, setApiCalled] = useState(false);

  const [_membershipData, setMembershipData] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState<any>(null);
  const appState = useRef(AppState.currentState);

  const [plans, setPlans] = useState<Member[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const isFocused = useIsFocused();

  const [editableMessage, setEditableMessage] = useState("");
  const [isInitialAmountDisabled, setInitialAmountDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createdMembershipId, setCreatedMembershipId] = useState<number | null>(null);


  const STORAGE_KEY = `initialAmountPaid-membership-${id}`;



  console.log("memberIdddd", id);
  console.log("planId", selectedPlanId);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/members/${id}`);
        setMember(response.data.data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    if (id) fetchMember();
  }, [id]);

  useEffect(() => {
    if (isFocused) {
      fetchPlans();
    }
  }, [isFocused]);

  useEffect(() => {
    if (modalVisible) {
      handleSubmit();
    }
  }, [modalVisible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (modalVisible) {
          setModalVisible(false);
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [modalVisible]);

  const handleConfirmPress = () => {
    setApiCalled(false);
    setModalVisible(true);
  };



  useEffect(() => {
    const fetchMembership = async () => {
      try {
        setLoading(true);
        const paidBefore = await AsyncStorage.getItem(STORAGE_KEY);

        if (paidBefore === "true") {
          setInitialAmountDisabled(true);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.BASE_URL}/membership/${id}/`);
        const membership = response.data.data;
        // setCreatedMembershipId(response.data.data.membership_id); 
        console.log("fdfd", membership.membership_id)


        if (membership?.initial_amount && membership.initial_amount > 0) {
          setInitialAmount(membership.initial_amount.toString());
          setInitialAmountDisabled(true);
          try {
            await AsyncStorage.setItem(STORAGE_KEY, "true");
          } catch (error) {
            console.error("Error saving initial amount state to AsyncStorage:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMembership();
  }, [id]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/plans/`);

      const plans = response.data.data;

      if (Array.isArray(plans)) {
        setPlans(plans);
      } else {
        console.warn("Unexpected data format:", response.data);
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setPickerVisible(false);
  };

  const handlePlanChange = (selectedPlanName: string) => {
    setPlan(selectedPlanName);

    const selected = plans.find((p) => p.plan_name === selectedPlanName);

    const amount = selected?.plan_amount || 0;
    setPlanAmount(amount);

    const discountValue = parseFloat(discount || "0");
    const received = amount - discountValue;
    // setAmountReceived(received.toString());

    const balance = amount - discountValue - received;
    setBalanceAmount(balance);

    if (selected?.id) {
      setSelectedPlanId(selected.id);
    }
  };

  const handleDiscountChange = (value: string) => {
    setDiscount(value);
    const discountValue = parseFloat(value || "0");
    const received = planAmount - discountValue;
    setAmountReceived(received.toString());

    const balance = planAmount - discountValue - received;
    setBalanceAmount(balance);
  };

  const handleAmountReceivedChange = (value: string) => {
    setAmountReceived(value);
    const received = parseFloat(value || "0");
    const discountValue = parseFloat(discount || "0");
    const balance = planAmount - discountValue - received;
    setBalanceAmount(balance);
  };

  const handleSubmit = async () => {
    let createdMembershipId: number | null = null;

    try {
      setIsSubmitting(true);

      const payload = {
        member_id: member.id,
        plan_id: selectedPlanId,
        discount: discount || 0,
        amount_received: amountReceived || 0,
        payment_method: paymentMethod,
        initial_amount: initialAmount || 0,
        balance: balanceAmount || 0,
        start_date: date.toISOString().split("T")[0],
      };

      const response = await axios.post(`${config.BASE_URL}/membership/create/`, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Membership added successfully!");
        setCreatedMembershipId(response.data.data.membership_id);
        console.log("createdMembershipId", createdMembershipId)
        setInitialAmountDisabled(true);

        try {
          await AsyncStorage.setItem(STORAGE_KEY, "true");
        } catch (error) {
          console.error("Error saving initial amount disabled flag:", error);
        }
      } else {
        Alert.alert("Error", "Unexpected server response.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Submission failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMembership = async () => {
      if (!paymentMethod) {
        Alert.alert("Please fill the Plan and Payment Method")
      }
      try {
        const response = await axios.get(`${config.BASE_URL}/members/${id}/`);
        const memberData = response.data;

        setMembershipData(memberData);

        if (memberData.initial_amount && memberData.initial_amount > 0) {
          setInitialAmount(memberData.initial_amount.toString());
          setInitialAmountDisabled(true);

          // Store in AsyncStorage to persist this state
          await AsyncStorage.setItem(`initialAmountPaid-${id}`, "true");
        } else {
          const paid = await AsyncStorage.getItem(`initialAmountPaid-${id}`);
          if (paid === "true") {
            setInitialAmountDisabled(true);
          }
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };

    fetchMembership();
  }, []);

  const getEndDate = () => {
    const selected = plans.find((p) => p.plan_name === plan);
    const days = parseInt(selected?.plan_duration_days || "0");
    const end = new Date(date);
    end.setDate(end.getDate() + days);

    return end.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    if (member && plan) {
      const paid = parseFloat(amountReceived || "0");
      const discountValue = parseFloat(discount || "0");
      const initialPaid = parseFloat(initialAmount || "0");

      let newMessage = "";

      // Case 1: Only Initial Amount is paid
      if (initialPaid > 0 && paid === 0 && discountValue === 0) {
        newMessage = `Hello ${member.name || "Member"},
            
    You have successfully paid the Initial Amount for the ${plan} plan.
    
    Initial Amount Paid: ${formatCurrency(initialPaid)}
    
    Thank you.`;
      }
      // Case 2: Full Membership (Initial Amount + Other Payments)
      else if (planAmount) {
        const balance = planAmount - discountValue - paid;

        newMessage = `Hello ${member.name || "Member"},
            
    Your membership to ${plan} was successfully added and will expire on ${getEndDate()}.
    
    Amount: ${formatCurrency(planAmount)}
    Initial Amount Paid: ${formatCurrency(initialPaid)}
    Discount: ${formatCurrency(discountValue)}
    Paid: ${formatCurrency(paid)}
    Balance: ${formatCurrency(balance)}
    
    Thank you.`;
      }

      setEditableMessage(newMessage);
    }
  }, [member, plan, discount, amountReceived, initialAmount, planAmount]);

  const handleSendWhatsApp = () => {
    const phoneNumber = member?.phone_number;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      editableMessage
    )}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "WhatsApp not installed on your device");
        }
      })
      .catch((err) => console.error("WhatsApp Error:", err));
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setModalVisible(false);

        navigation.navigate("Member Details", {
          id: Array.isArray(id) ? id[0] : id,
          membership_id: createdMembershipId,
        });
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [id, createdMembershipId]); // Ensure dependencies are included



  return (
    <ScrollView>
      <View style={styles.container}>
        {member && (
          <ProfileMember
            key={member.id}
            id={member.id}
            profile_picture={member.profile_picture}
            name={member.name}

            phone_number={member.phone_number}
            gender={member.gender}
            status={member.status}
          />
        )}

        <View style={styles.subContainer}>
          <View style={styles.membersubContainers}>
            <Text style={styles.title}>Select Plan</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("New Plan" as never)}
            >
              <Text style={styles.addButtonText}> + </Text>
            </TouchableOpacity>
          </View>

          <View>
            <RadioButton.Group onValueChange={handlePlanChange} value={plan}>
              {plans.map((item, index) => (
                <View key={index}>
                  <View style={styles.radioButton}>
                    <RadioButton value={item.plan_name} />
                    <Text style={styles.radioText}>{item.plan_name}</Text>
                  </View>
                  <Text style={styles.amount}>
                    {" "}
                    ₹{item.plan_amount} - {item.plan_duration_days} days
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
          <Text style={styles.Initialtext}>Initial Amount</Text>

          <View style={styles.initialAmountContainer}>
            <View style={styles.inputContainer}>
              {!loading && (
                <TextInput
                  placeholder="Initial Amount"
                  keyboardType="numeric"
                  value={initialAmount}
                  onChangeText={setInitialAmount}
                  editable={!isInitialAmountDisabled}
                  style={[
                    styles.input,
                    isInitialAmountDisabled && styles.disabledInput,
                  ]}
                />
              )}
            </View>

            {isInitialAmountDisabled && (
              <Text style={styles.paidText}>Paid</Text>
            )}
          </View>

          <View style={styles.paymentContainer}>
            <Text style={styles.text}>Discount</Text>
            <Text style={styles.text}>Amount received</Text>
          </View>
          <View style={styles.paymentSubContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Discount"
                keyboardType="numeric"
                value={discount}
                onChangeText={handleDiscountChange}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Amount Received"
                keyboardType="numeric"
                value={amountReceived}
                onChangeText={handleAmountReceivedChange}
              />
            </View>
          </View>
        </View>
        {amountReceived !== "" && (
          <Text
            style={{
              marginTop: 5,
              marginRight: 50,
              fontWeight: "bold",
              alignSelf: "flex-end",
              color: balanceAmount === 0 ? "green" : "red",
            }}
          >
            Balance: ₹{balanceAmount.toFixed(2)}
          </Text>
        )}

        <Text style={styles.paymentTitle}>Payment Method</Text>
        <View>
          <RadioButton.Group
            onValueChange={(value) => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.radioButton}>
              <View style={styles.radioOption}>
                <RadioButton value="cash" />
                <Text style={styles.radioText}>Cash</Text>
              </View>

              <View style={styles.leftspacer} />

              <View style={styles.radioOption}>
                <RadioButton value="upi" />
                <Text style={styles.radioText}>UPI</Text>
              </View>
            </View>

            <View style={styles.radioButton}>
              <View style={styles.radioOption}>
                <RadioButton value="Credit card" />
                <Text style={styles.radioText}>Credit card</Text>
              </View>

              <View style={styles.spacer} />

              <View style={styles.radioOption}>
                <RadioButton value="Debit card" />
                <Text style={styles.radioText}>Debit card</Text>
              </View>
            </View>

            <View style={styles.radioOptions}>
              <RadioButton value="Net Banking" />
              <Text style={styles.radioText}>Net Banking</Text>
            </View>
          </RadioButton.Group>
        </View>
        <Text style={styles.memberStartDateText}> Membership start date</Text>
        <Pressable
          style={styles.inputWrapper}
          onPress={() => setPickerVisible(true)}
        >
          <TextInput
            style={styles.input}
            editable={false}
            value={date.toLocaleDateString()}
            pointerEvents="none"
          />
          <Ionicons
            name="calendar"
            size={24}
            color="#666"
            style={styles.icon}
          />
        </Pressable>

        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="date"
          date={date}
          // minimumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
        />
        {/* <TouchableOpacity style={styles.sumbitButton} onPress={handleSubmit}>
          <Text style={styles.buttontext}>Confirm</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.sumbitButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttontext}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Send Message?</Text>
            <Text style={styles.messageTitle}>
              Your message would look like this
            </Text>

            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>To:</Text>
              <Text style={styles.phoneNumber}>
                +{member?.phone_number || "N/A"}
              </Text>
            </View>
            <Text style={styles.title}>Message</Text>
            <View style={styles.messageSubContainer}>
              <TextInput
                style={styles.textArea}
                multiline
                value={editableMessage}
                onChangeText={setEditableMessage}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              style={styles.sendMessageButton}
              onPress={handleSendWhatsApp}
            >
              <Text style={styles.buttontext}>Send message</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.editButton} onPress={() => setShowEdit(!showEdit)}>
              <Text style={styles.buttontext}>{showEdit ? "Done" : "Edit"}</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddMembership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  subContainer: {
    marginTop: 10,
  },
  membersubContainers: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginRight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    paddingLeft: 12,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1A18",
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },

  radioButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOptions: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    fontSize: 14,
    fontWeight: 800,
  },

  radioLeftText: {
    display: "flex",
    fontSize: 14,
    fontWeight: 600,
  },
  spacer: {
    flex: 0.2,
  },
  leftspacer: {
    flex: 0.3,
  },
  amount: {
    marginLeft: 34,
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: 600,
    paddingTop: 20,
    marginBottom: 10,
  },
  paymentContainer: {
    padding: 10,
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontWeight: 600,
  },
  Initialtext: {
    fontSize: 16,
    fontWeight: 600,
    paddingLeft: 10,
    marginBottom: 2

  },
  InitialAmount: {
    fontSize: 16,
    fontWeight: 600,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  paymentSubContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "50%",
    marginBottom: 10,
    paddingLeft: 5,
  },
  inputbox: {
    fontSize: 17,
    color: "#62707D",
    fontFamily: "Jost",
    fontWeight: 600,
    paddingLeft: 15,
  },
  memberStartDateText: {
    marginTop: 30,
    fontFamily: "Jost",
    fontWeight: 800,
    color: "#111827",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  sumbitButton: {
    backgroundColor: "#1B1A18",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginTop: 20,
    marginBottom: 30,
  },

  buttontext: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 18,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Jost",
    lineHeight: 30,
    paddingLeft: 10,
  },
  messageText: {
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "Jost",
    lineHeight: 40,
  },
  messageTitle: {
    fontFamily: "Jost",
    paddingLeft: 10,
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 11,
    marginTop: 30,
    marginBottom: 30,
    gap: 10,
  },
  phoneNumber: {
    borderWidth: 1,
    borderColor: "#E2E3E8",
    backgroundColor: "#E2E3E8",
    color: "#111827",
    fontWeight: 600,
    fontFamily: "Jost",
    borderRadius: 5,
    padding: 10,
  },
  messageSubContainer: {
    backgroundColor: "#E2E3E8",
    borderRadius: 5,
    padding: 20,
    margin: 10,
    width: "95%",
    paddingBottom: 45,
  },
  memberName: {
    fontFamily: "Jost",
    lineHeight: 40,
    marginBottom: 20,
    fontWeight: 600,
    fontSize: 16,
  },
  message: {
    fontFamily: "Jost",
    fontWeight: 600,
    fontSize: 15,
  },
  thankYouText: {
    marginTop: 30,
  },
  AmmountContainer: {
    marginTop: 10,
  },
  sendMessageButton: {
    borderWidth: 1,
    borderColor: "#1B1A18",
    backgroundColor: "#1B1A18",
    borderRadius: 4,
    width: "50%",
    padding: 13,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  textArea: {
    borderRadius: 8,
    fontSize: 16,
    minHeight: 160,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  paidText: {
    color: "green",
    fontWeight: "bold",
    marginLeft: 8,
    alignSelf: "center",
    textAlign: "center",
  },
  inputContainers: {
    flexDirection: "row",
    alignItems: "center",
  },
  initialAmountContainer: {
    flexDirection: "row",
  },
});
