import { Entypo, Feather } from "@expo/vector-icons";
import {
  Image,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Text, StyleSheet, TextInput } from "react-native";
import EditMembers from "./EditMembers";
import { useState } from "react";
import config from "@/app/config";
import { Modal } from "react-native";

type members = {
  id: number;
  profile_picture: string | number;
  name: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  status: string | undefined;
  blood_group: string;
  joining_date: string;
  address: string;
  notes: string;
};
const ProfileMemberDetails = ({
  id,
  profile_picture,
  name,
  phone_number,
  gender,
  status,
  date_of_birth,
  blood_group,
  address,
  joining_date,
  notes,
}: members) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [model, setModel] = useState(false);

  const [modalVisibleMember, setModalVisibleMember] = useState(false);
  const [message, setMessage] = useState("");

  const handleMemberMessages = () => {
    setModalVisibleMember(true);
  };

  //  const handleMemberMessage = () =>{
  //      const phoneNumber =  phone_number;
  //             const url = `whatsapp://send?phone=${phoneNumber}`;
  //             Linking.openURL(url).catch(() => {
  //               alert('Make sure WhatsApp is installed on your device');
  //             });
  //  }

  const sendWhatsAppMessage = () => {
    if (!message.trim()) {
      alert("Please type a message");
      return;
    }

    const url = `whatsapp://send?phone=${phone_number}&text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });

    setModalVisibleMember(false);
    setMessage("");
  };

  return (
    <TouchableOpacity onPress={() => setModelVisible(true)}>
      <View style={style.container}>
        <View style={style.subcontainer}>
          <Image
            source={
              typeof profile_picture === "string"
                ? { uri: `${config.BASE_URL}/${profile_picture}` }
                : profile_picture
            }
            style={style.image}
          />

          <View style={style.textContainer}>
            <View style={style.numberNameRow}>
              <Text style={style.name}>{name}</Text>
              <View style={style.iconContainer}>
                {/* <AntDesign
                                    name="delete"
                                    size={22}
                                    color="#F34E3A"
                                    style={style.deletIcon}
                                /> */}
                <EditMembers
                  id={id}
                  visible={editModalVisible}
                  onClose={() => setEditModalVisible(false)}
                />
                <TouchableOpacity onPress={() => setModel(true)}>
                  <Entypo name="dots-three-vertical" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={style.phoneNumber}>{phone_number}</Text>
          </View>
        </View>

        <View style={style.bottomContainer}>
          {status && (
            <View style={style.statusContainer}>
              <Entypo
                name="dot-single"
                size={25}
                color={status === "Active" ? "#1EAF5B" : "#FFA500"}
                style={style.dot}
              />
              <Text style={style.statusText}>{status}</Text>
            </View>
          )}
          <Text style={style.plan}>{gender}</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelVisible}
        onRequestClose={() => setModelVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModelVisible(false)}>
        <View style={style.modalOverlay}>
            
          <View style={style.modalContent}>
            <View style={style.bottomLine}></View>

            <Text style={style.modalText}>Member Info</Text>
            <View style={style.modelSubcontainer}>
              <Text>Gender</Text>
              <Text>Joining date</Text>
            </View>
            <View style={style.modelSubcontainer}>
              <Text style={style.text}>{gender || "--"}</Text>
              <Text style={style.text}>Joining date</Text>
            </View>

            <View style={style.modelSubcontainer}>
              <Text>DOB</Text>
              <Text>Blood Group</Text>
            </View>
            <View style={style.modelSubcontainer}>
              <Text style={style.text}>
                {(date_of_birth || "").split("-").reverse().join("-")}
              </Text>
              <Text style={style.text}>{blood_group || "--"}</Text>
            </View>

            <Text style={style.title}>Address</Text>
            <Text style={style.text}>{address || "--"}</Text>

            <Text style={style.title}>Notes</Text>
            <Text style={style.text}>{notes || "--"}</Text>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleMember}
        onRequestClose={() => setModalVisibleMember(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisibleMember(false)}>
          <View style={style.modalContainer}>
            <View style={style.modalContents}>
              <Text style={style.modalTitle}>Send WhatsApp Message</Text>
              <TextInput
                style={style.input}
                multiline
                placeholder="Type your message here..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={style.sendButton}
                onPress={sendWhatsAppMessage}
              >
                <Text style={style.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={model}
        onRequestClose={() => setModel(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModel(false)}>
          <View style={style.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={style.modalContent}>
                <View style={style.modalRow}>
                  <Feather
                    name="message-circle"
                    size={22}
                    color="black"
                    style={style.modalIcon}
                  />
                  <TouchableOpacity onPress={handleMemberMessages}>
                    <Text style={style.modalItem}>Message Template</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
};

export default ProfileMemberDetails;

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: 160,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E6EA",
    margin: 5,
    padding: 20,
    borderRadius: 13,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    top: 8,
  },
  phoneNumber: {
    color: "#555",
    fontSize: 14,
    marginTop: 2,
  },
  plan: {
    backgroundColor: "#eff0f4",
    marginTop: 20,
    borderRadius: 15,
    fontSize: 14,
    fontFamily: "Jost",
    padding: 10,
    fontWeight: "700",
    color: "black",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  status: {
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#E8F7F0",
    color: "black",
  },
  dot: {
    fontSize: 20,
  },
  statusContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: "#eff0f4",
    marginTop: 20,
    borderRadius: 15,
    fontFamily: "Jost",
    padding: 10,
    fontWeight: "700",
    color: "black",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },

  activeStatus: {
    backgroundColor: "#eff0f4",
  },
  inactiveStatus: {
    backgroundColor: "#eff0f4",
  },
  statusText: {
    fontWeight: "700",
    color: "black",
    alignItems: "center",
    fontSize: 14,
  },
  deletIcon: {
    top: 2,
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
    fontSize: 16,
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
  },
  modelSubcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 40,
    marginLeft: 10,
  },
  text: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
    top: 5,
    fontFamily: "Jost",
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  title: {
    marginLeft: 10,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  modalIcon: {
    marginRight: 3,
  },
  modalItem: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
    color: "#1E3A8A",
  },
  // modalItem: {
  //     color: '#007bff',
  //     fontSize: 16,
  //     padding: 10,
  //   },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContents: {
    backgroundColor: "white",
    padding: 26,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  sendButton: {
    alignSelf: "flex-end",
    backgroundColor: "#1b1a18",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  sendText: {
    color: "white",
    fontWeight: "bold",
  },
});
