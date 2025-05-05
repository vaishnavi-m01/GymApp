import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type members = {
  id: number;
  image: string;
  name: string;
  duration: string;
  member_phone:string;
  plan:string;
  end_date: string; 
};
const ExpiringDays = ({ image, name, duration,member_phone,plan,end_date }: members) => {
  const [_changePassword, setChangePassword] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState(
    `Hello ${name},\n\nWe regret to inform you that your membership to ${plan} has expired on ${end_date} and the due date has passed.\n\nPlease renew your membership as soon as possible.\n\nThank you,\n{gymName}`
  );
  


  useEffect(() => {
    const loadTemplate = async () => {
      const saved = await AsyncStorage.getItem("@Membership_expired");
      if (saved) setMessage(saved);
    };
    loadTemplate();
  }, []);

  const handleSendWhatsApp = () => {
    const phoneNumber = {member_phone};
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp not installed!");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <ScrollView>
      <View style={style.container}>
        <View style={style.subcontainer}>
          {/* <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={style.image}
          /> */}

          <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={style.image}
          />

          <View style={style.textContainer}>
            <View style={style.numberNameRow}>
              <Text style={style.name}>{name}</Text>
              <View style={style.iconContainer}>
                <TouchableOpacity
                  style={style.ReminderButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Image
                    source={require("../../../assets/images/ReminderIcon.png")}
                    style={style.icon}
                  />
                  <Text style={style.buttonText}>Send Reminder</Text>
                </TouchableOpacity>
                <AntDesign
                  name="right"
                  size={22}
                  color="#717171"
                  style={style.arrowIcon}
                />
              </View>
            </View>
            <Text style={style.durationText}>Duration: {duration}</Text>
          </View>
        </View>
      </View>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={style.modalOverlay}>
          <View style={style.modalContent}>
            <Text style={style.modalText}>Send Message?</Text>
            <Text style={style.messageTitle}>
              Your message would look like this
            </Text>

            <View style={style.messageContainer}>
              <Text style={style.messageText}>To:</Text>
              <Text style={style.phoneNumber}>+919876543210</Text>
            </View>
            <Text style={style.title}>Message</Text>
            <View style={style.messageSubContainer}>
              <Text style={style.memberName}>Hello Vaishu,</Text>
              <Text style={style.message}>
                Your membership to 8 will expire on 17 Apr 2025
              </Text>
              <View style={style.AmmountContainer}>
                {" "}
                <Text style={style.message}>
                  Please renew your membership as soon as possible.{" "}
                </Text>
                <Text style={style.thankYouText}>Thank you, </Text>
              </View>
            </View>
            <TouchableOpacity
              style={style.sendMessageButton}
              onPress={handleSendWhatsApp}
            >
              <Text style={style.buttontext}>Send message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={style.modalOverlay}>
            <View style={style.modalContent}>
              <Text style={style.modalText}>Send Message?</Text>
              <Text style={style.messageTitle}>
                Your message would look like this
              </Text>

              <View style={style.messageContainer}>
                <Text style={style.messageText}>To:</Text>
                <Text style={style.phoneNumber}>+91{member_phone}</Text>
              </View>

              <Text style={style.title}>Message</Text>

              <TextInput
                style={style.messageInput}
                value={message}
                onChangeText={setMessage}
                editable={false}
                multiline
              />

              <TouchableOpacity
                style={style.sendMessageButton}
                onPress={handleSendWhatsApp}
              >
                <Text style={style.buttontext}>Send message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default ExpiringDays;

const style = StyleSheet.create({
  container: {
    width: "98%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E6EA",
    margin: 5,
    padding: 10,
    borderRadius: 400,
    marginBottom: 15,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  numberNameRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 8,
  },

  name: {
    color: "#000000",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "bold",
    top:8
  },

  dot: {
    fontSize: 20,
  },

  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },

  icon: {
    width: 20,
    height: 20,
  },

  ReminderButton: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F5FFD4",
    backgroundColor: "#F5FFD4",
    padding: 5,
    gap: 10,
  },
  buttonText: {
    color: "#666A75",
  },
  arrowIcon: {
    bottom: 5,
  },
  durationText: {
    paddingTop: 7,
    fontSize: 12,
    color: "#73767D",
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
    marginTop: 10,
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
  title: {
    fontSize: 16,
    fontWeight: 600,
    paddingLeft: 12,
  },
  buttontext: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 18,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#E2E3E8",
    backgroundColor: "#E2E3E8",
    borderRadius: 5,
    padding: 10,
    paddingLeft: 18,
    marginVertical: 20,
    minHeight: 100,
    fontFamily: "Jost",
    fontWeight: 600,
  },
});
