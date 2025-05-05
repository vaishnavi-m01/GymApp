import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import ProfileMemberDetails from "./components/members/ProfileMemberDetails";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import RecentTransaction from "./components/transaction/RecentTransaction";
import RenewalDetails from "./components/transaction/RenewalDetails";
import config from "./config";

type RootStackParamList = {
  Home: { updatedImage?: string };
  Profile: { id: string };
  "Birthday Member": { decreaseBirthdayCount: () => void };
  "Member Details": { id: number; membership_id?: number };
  "Message Templates": undefined;
};

type Transaction = {
  id: number;
  payment_date: string;
  amount_paid: string;
  settle_balance: string;
  payment_method: string;
  balance_status: string;
  membership: number;
  member_name: string;
  profile_picture: string;
  plan_name: string;
  renewal_due?: string;
  plan: string;
};

const MemberDetails = () => {
  const { id, membership_id } = useLocalSearchParams();
  const [member, setMember] = useState<any>(null);
  const [membership, setMembership] = useState<any[]>([]);
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modelVisible, setModelVisible] = useState(false);
  const [settlemodel, setSettleModel] = useState(false);
  const [whatsAppModel, setWhatsAppModel] = useState(false);
  const [birthMessage, setBirthMessage] = useState(false);

  const [membershipDetails, setMembershipDetails] = useState<Transaction | null>(null);

  const [message, setMessage] = useState(
    `Happy Birthday! 🎉. May your day be filled with laughter, joy, and cherished moments with loved ones.`
  );

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
    const loadTemplate = async () => {
      const saved = await AsyncStorage.getItem("@birthday_message_template");
      if (saved) setMessage(saved);
    };
    loadTemplate();
  }, []);


  const handleSendWhatsApp = () => {
    const phoneNumber = member?.phone_number;
    const name = member.name;

    const message = `Hello ${name}\n\n Thank you for paying ₹3,000 towards
your balance settlement. Your current
balance is now ₹0 \n\n Thank you.`;

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
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
  const isTodayBirthday = (dob: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dob);

    return (
      birthDate.getDate() === today.getDate() &&
      birthDate.getMonth() === today.getMonth()
    );
  };

  const formattedDate = member?.joining_date
    ? new Date(member.joining_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "";

  const handleSendBirthDayMessageWhatsApp = () => {
    const phoneNumber = member?.phone_number;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    // use Linking to open WhatsApp
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  useEffect(() => {
    const fetchMemberShip = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/transactions/member/${id}`
        );
        console.log("Fetched Membership Data:", response.data);

        const membershipData = response.data || [];

        setMembership(membershipData);

        const partiallyPaidRecord = membershipData.find(
          (item: any) => item.balance_status === "Partially Paid"
        );

        if (partiallyPaidRecord) {
          // Set settle_balance into amount input
          setAmount(partiallyPaidRecord.settle_balance?.toString() || "0");
        } else {
          setAmount("");
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
        setMembership([]);
        setAmount("");
      }
    };

    if (id) fetchMemberShip();
  }, [id]);

  console.log("membershipMemberDetails", membership_id)



  useEffect(() => {
    const fetchMembershipDetails = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/membership/${membership_id}`);
        setMembershipDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching membership details:", error);
      }
    };

    if (membership_id) fetchMembershipDetails();
  }, [membership_id]);




  console.log("MembershipIddd", id)

  const handleSave = async () => {
    try {
      const payload = {
        settle_balance: amount,
        payment_method: paymentMethod,
        membership: membership[0].membership,
      };

      const response = await axios.post(
        `${config.BASE_URL}/transactions/create/`,
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        setSettleModel(false);
        setWhatsAppModel(true);

        Alert.alert(
          "Payment Successful!",
          "Your payment has been processed successfully."
        );
      } else {
        console.log("Error:", response.data);
      }
    } catch (error) {
      console.log("Error while saving:", error);
      Alert.alert("Payment Failed!", "Something went wrong. Please try again.");
    }
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        {member && (
          <ProfileMemberDetails
            key={member.id}
            id={member.id}
            profile_picture={member.profile_picture}
            name={member.name}
            phone_number={member.phone_number}
            gender={member.gender}
            status={member.status}
            date_of_birth={member.date_of_birth}
            blood_group={member.blood_group}
            joining_date={member.joining_date}
            address={member.address}
            notes={member.notes}
          />
        )}

        {member && isTodayBirthday(member.date_of_birth) && (
          <View style={styles.birthdayMessageContainer}>
            <Text style={styles.messagetext}>
              🎉 It's {member.name}'s birthday today 🥳.
            </Text>
            <Text style={styles.messagetext}>
              Wish your client a very happy birthday and
            </Text>
            <Text style={styles.messagetext}>make their day better 🎊</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setBirthMessage(true)}
            >
              <Text style={styles.buttonText}>🥳🥳 Wish now 🥳🥳</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.paymentContainer}>
          <TouchableOpacity
            style={styles.subContainers}
            onPress={() => {
              if (membership[0]?.balance_status !== "Fully Paid") {
                setModelVisible(true); // Only open if NOT Fully Paid
              }
            }}
          >
            <View>
              <View style={styles.memberContents}>
                <AntDesign name="pay-circle1" size={30} color="#F58E48" />
                <Text style={styles.blanceText}>Balance</Text>
              </View>
              <Text style={styles.paymentStatus}>
                {membership[0]?.balance_status || "Loading..."}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.subContainers}>
            <View style={styles.memberContents}>
              <Text style={styles.blanceText}>Joined Date</Text>
            </View>
            <Text style={styles.joinedDate}>{formattedDate}</Text>
          </View>
        </View>

        <Text style={styles.text}>Memberships</Text>
        {/* <View style={styles.membershipContainer}>
          <View style={styles.membershipSubContainer}>
            <Text style={styles.planText}>3month plan</Text>
            <AntDesign name="arrowright" size={22} color="black" />
          </View>
          <View style={styles.durationContainer}>
            <View style={styles.subDurationContainer}>
              <Entypo
                name="dot-single"
                size={22}
                color={"#1DAF60"}
                style={styles.dotIcon}
              />

              <Text>Renewal due in 89 days</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleClick}>
            <Text style={styles.buttonText}>Add Upcoming</Text>
          </TouchableOpacity>
        </View> */}

        {membershipDetails && (
          <RenewalDetails
            plan={membershipDetails.plan}
            renewal_due={membershipDetails.renewal_due}
          />
        )}




        <Text style={styles.transactionText}>Recent transaction</Text>
        {/* <View style={styles.transactionContainer}>
          <View style={styles.transactionSubContainer}>
            <Text style={styles.title}>3month</Text>

            <View style={styles.rightContainer}>
              <Text style={styles.payementType}>UPI</Text>
              <Text style={styles.amountText}>INR300</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.durationText}>
              Duration: 18 Mar 2025 - 15 Jun 2025
            </Text>
            <AntDesign name="arrowright" size={25} color="black" />
          </View>
        </View> */}

        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingVertical: 10 }}
        >
          {Array.isArray(membership) &&
            membership.map((txn) => (
              <RecentTransaction
                key={txn.id}
                planName={txn.plan_name}
                paymentType={txn.payment_method}
                amount={`₹${txn.amount_paid}`}
                paymentDate={txn.payment_date}
              />
            ))}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelVisible}
        onRequestClose={() => setModelVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModelVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.bottomLine}></View>

              <Text style={styles.modalText}>Balance</Text>
              <View style={styles.modelSubcontainer}>
                <Text style={styles.title}>Pending Amount</Text>
                {Array.isArray(membership) &&
                  membership.length > 0 &&
                  membership[0]?.settle_balance ? (
                  <Text>{membership[0]?.settle_balance}</Text>
                ) : (
                  <Text>No pending amount</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  setModelVisible(false);
                  setSettleModel(true);
                }}
              >
                <Text style={styles.buttonText}>Settle Balance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settlemodel}
        onRequestClose={() => setSettleModel(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={styles.modalContent}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.bottomLine}></View>
                <Text style={styles.modalText}>Settle Balance</Text>

                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputbox}
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                </View>

                <Text style={styles.paymentTitle}>Payment Method</Text>
                <View>
                  <RadioButton.Group
                    onValueChange={(value) => setPaymentMethod(value)}
                    value={paymentMethod}
                  >
                    <View style={styles.radioOptions}>
                      <RadioButton value="cash" />
                      <Text style={styles.radioText}>Cash</Text>
                    </View>

                    <View style={styles.radioOptions}>
                      <RadioButton value="upi" />
                      <Text style={styles.radioText}>UPI</Text>
                    </View>

                    <View style={styles.radioOptions}>
                      <RadioButton value="credit card" />
                      <Text style={styles.radioText}>Credit card</Text>
                    </View>

                    <View style={styles.radioOptions}>
                      <RadioButton value="Debit card" />
                      <Text style={styles.radioText}>Debit card</Text>
                    </View>

                    <View style={styles.radioOptions}>
                      <RadioButton value="Net Banking" />
                      <Text style={styles.radioText}>Net Banking</Text>
                    </View>
                  </RadioButton.Group>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.cancelbutton}
                      onPress={() => setSettleModel(false)}
                    >
                      <Text style={styles.cancelbuttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleSave}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* whatsapp message container */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={whatsAppModel}
        onRequestClose={() => setWhatsAppModel(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWhatsAppModel(false)}>
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
                <Text style={styles.memberName}> Hello vaishu,</Text>
                <Text style={styles.message}>
                  Your membership to was successfully added and will expire .
                </Text>
                <View style={styles.AmmountContainer}>
                  {" "}
                  {/* <Text style={styles.message}>Amount: {formatCurrency(planAmount)}</Text>
                          <Text style={styles.message}>Paid: {formatCurrency(parseFloat(amountReceived || "0"))}</Text>
                          <Text style={styles.message}>Balance: {formatCurrency(balanceAmount)}</Text> */}
                  <Text style={styles.thankYouText}>Thank you </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.sendMessageButton}
                onPress={handleSendWhatsApp}
              >
                <Text style={styles.buttontext}>Send message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Birthday Message */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={birthMessage}
        onRequestClose={() => setBirthMessage(false)}
      >
        <TouchableWithoutFeedback onPress={() => setBirthMessage(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              // style={styles.keyboardAvoidingView}
              >
                <ScrollView
                  // contentContainerStyle={styles.scrollViewContent}
                  keyboardShouldPersistTaps="handled"
                >
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
                        style={styles.textInput}
                        multiline
                        value={message}
                        editable={false}
                        textAlignVertical="top"
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.sendMessageButton}
                      onPress={handleSendBirthDayMessageWhatsApp}
                    >
                      <Text style={styles.buttontext}>Send message</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default MemberDetails;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 60,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  subContainers: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: "45%",
  },
  memberContents: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  blanceText: {
    fontSize: 19,
    fontFamily: "Jost",
    fontWeight: 600,
  },
  paymentContainer: {
    display: "flex",
    flexDirection: "row",
  },
  paymentStatus: {
    fontSize: 17,
    fontFamily: "Jost",
    color: "#111827",
    fontWeight: 800,
    paddingLeft: 5,
    paddingTop: 10,
  },
  joinedDate: {
    fontSize: 16,
    paddingTop: 15,
    color: "#111827",
    fontWeight: 800,
  },
  text: {
    fontSize: 16,
    paddingTop: 15,
    color: "#111827",
    fontWeight: 700,
    paddingLeft: 13,
    marginBottom: 12,
  },
  membershipContainer: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    width: "90%",
  },
  planText: {
    color: "#111827",
    fontWeight: 500,
    fontSize: 16,
  },
  membershipSubContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EFF0F4",
    padding: 5,
    borderRadius: 17,
    width: "70%",
    backgroundColor: "#EFF0F4",
  },
  subDurationContainer: {
    display: "flex",
    flexDirection: "row",
  },
  dotIcon: {
    fontWeight: 900,
  },
  submitButton: {
    backgroundColor: "#1B1A18",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginTop: 40,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
  cancelbuttonText: {
    textAlign: "center",
    color: "#1B1A18",
    fontWeight: "600",
    fontSize: 18,
  },
  transactionText: {
    marginTop: 20,
    padding: 5,
    paddingLeft: 15,
    fontWeight: 700,
    fontSize: 18,
    fontFamily: "Jost",
  },
  transactionContainer: {
    margin: 10,
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    padding: 10,
    width: "90%",
  },
  transactionSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontFamily: "Jost",
    fontWeight: 600,
    fontSize: 15,
    color: "#111827",
  },
  payementType: {
    borderWidth: 1,
    borderColor: "#E3E4E8",
    backgroundColor: "#E3E4E8",
    borderRadius: 15,
    width: 50,
    padding: 1,
    color: "#090A0E",
    textAlign: "center",
    fontWeight: 700,
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 700,
    paddingTop: 0,
  },
  durationText: {
    padding: 10,
    paddingBottom: 3,
    color: "#666A75",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    marginTop: 25,
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "Jost",
    lineHeight: 40,
    paddingLeft: 10,
    bottom: 4,
  },
  messageText: {
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "Jost",
    lineHeight: 40,
  },
  bottomLine: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#617085",
    backgroundColor: "#617085",
    width: 90,
    borderRadius: 50,
    fontWeight: 600,
  },
  modelSubcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 40,
    marginLeft: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 18,
    width: "100%",
    marginBottom: 10,
    padding: 10,
  },
  inputbox: {
    flex: 1,
    fontSize: 17,
    color: "#62707D",
    fontFamily: "Jost",
    fontWeight: "600",
    paddingLeft: 15,
  },
  label: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 50,
    paddingLeft: 5,
  },
  paymentTitle: {
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: 600,
    paddingTop: 20,
    marginBottom: 10,
  },
  radioOptions: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Jost",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 6,
    gap: 10,
  },
  cancelbutton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    width: "50%",
    padding: 10,
    marginTop: 40,
  },
  submitBtn: {
    backgroundColor: "#1B1A18",
    borderWidth: 1,
    borderRadius: 10,
    width: "50%",
    padding: 10,
    marginTop: 40,
  },

  messageContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 11,
    marginTop: 30,
    marginBottom: 30,
    gap: 10,
  },
  messageTitle: {
    fontFamily: "Jost",
    paddingLeft: 10,
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
    borderWidth: 1,
    borderColor: "#E2E3E8",
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
  birthdayMessageContainer: {
    padding: 10,
    marginTop: 10,
    margin: 5,
  },
  buttontext: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 18,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ffcccc",
    backgroundColor: "red",
    borderRadius: 15,
    marginTop: 10,
  },
  // buttonText:{
  //     textAlign:"center",
  //     fontFamily: "Jost",
  //     color: "#fff"
  // }
  messagetext: {
    textAlign: "center",
    fontFamily: "Jost",
    fontWeight: 800,
    fontSize: 14,
  },
  textInput: {
    lineHeight: 30,
    // paddingTop:30,
  },
});
