import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import config from "../../config";
import EditMembers from "../members/EditMembers";

type MembersProps = {
  id: number;
  profile_picture: string | number;
  name: string;
  phone_number: string;
  plan: string;
  status: string | undefined;
  onDelete: (id: number) => void;
};

const MembersPage = ({
  id,
  profile_picture,
  name,
  phone_number,
  plan,
  status,
  onDelete,
}: MembersProps) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [members, setMembers] = useState<MembersProps[]>([]);


  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${config.BASE_URL}/members/${id}/`, {
        withCredentials: true,
        timeout: 5000,
      });

      setShowDeleteModal(false);
      Alert.alert("Success", "Member deleted successfully");
      onDelete(id); // Inform parent to remove from UI
    } catch (err: any) {
      console.log("Error deleting member:", err.message || err);

      if (err.response) {
        Alert.alert("Error", `Server responded with ${err.response.status}`);
      } else if (err.request) {
        // Assume success based on backend logs
        setShowDeleteModal(false);
        Alert.alert("Success", "Member deleted");
        onDelete(id);
      } else {
        Alert.alert("Error", err.message);
      }
    }
  };




  return (
    <View style={style.container}>
      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View style={style.modalOverlay}>
          <View style={style.modalContainer}>
            <Text style={style.modalTitle}>Delete Member</Text>
            <Text style={style.modalText}>
              Are you sure you want to delete {name}?
            </Text>
            <View style={style.modalButtons}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={[style.button, style.cancelButton]}
              >
                <Text style={style.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(id)}
                style={[style.button, style.deleteButton]}
              >
                <Text style={[style.buttonText, { color: "#fff" }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Member Card */}
      <View style={style.subcontainer}>
      <Image
        source={typeof profile_picture === "string" ? { uri: profile_picture } : profile_picture}
        style={style.image}
      />
        <View style={style.textContainer}>
          <View style={style.numberNameRow}>
            <Text style={style.name}>{name}</Text>
            <View style={style.iconContainer}>
              <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                <AntDesign name="delete" size={20} color="#F34E3A" />
              </TouchableOpacity>
              <EditMembers id={id} visible={editModalVisible} onClose={() => setEditModalVisible(false)} />
            </View>
          </View>
          <Text style={style.phoneNumber}>{phone_number}</Text>
        </View>
      </View>

      <View style={style.bottomContainer}>
        <Text style={style.plan}>{plan}</Text>
        {status && (
          <View
            style={[
              style.status,
              status === "Active" ? style.activeStatus : style.inactiveStatus,
            ]}
          >
            <View style={style.statusContainer}>
              <Entypo
                name="dot-single"
                size={25}
                color={status === "Active" ? "#1EAF5B" : "#FFA500"}
                style={style.dot}
              />
              <Text style={style.statusText}>{status}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MembersPage;

const style = StyleSheet.create({
  container: {
    width: "90%",
    height: 130,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#E5E6EA",
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    borderRadius: 13,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginTop: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    padding: 5,
    marginTop: 10,
    paddingLeft: 10,
    width: "40%",
    borderRadius: 15,
    backgroundColor: "#E8F7F0",
  },
  dot: {
    fontSize: 20,
  },
  statusContainer: {
    flexDirection: "row",
    padding: 3,
    alignContent: "center",
    paddingLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },
  activeStatus: {
    backgroundColor: "#E8F7F0",
  },
  inactiveStatus: {
    backgroundColor: "#FFE5E5",
  },
  statusText: {
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    alignSelf: "center",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  deleteButton: {
    backgroundColor: "#F34E3A",
  },
  buttonText: {
    fontWeight: "600",
  },
});
