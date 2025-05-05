import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";

import EditPlan from "./EditPlan";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import axios from "axios";
import config from "@/app/config";
import { Alert } from "react-native";

type members = {
  id: number;
  plan_name: string;
  plan_amount: number;
  plan_duration: string;
  onDelete: (id: number) => void;
  onEdit: (plan: any) => void; 


};
const Plan = ({ id, plan_name, plan_amount, plan_duration, onDelete,onEdit  }: members) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${config.BASE_URL}/plans/${id}/`, {
        withCredentials: true,
        timeout: 5000,
      });

      setShowDeleteModal(false);
      Alert.alert("Success", "Member deleted successfully");
      onDelete(id);
    } catch (err: any) {
      console.log("Error deleting member:", err.message || err);

      if (err.response) {
        Alert.alert("Error", `Server responded with ${err.response.status}`);
      } else if (err.request) {
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
      <View style={style.subcontainer}>
        <View style={style.textContainer}>
          <View style={style.numberNameRow}>
            <Text style={style.name}>{plan_name}</Text>
            <View style={style.iconContainer}>
              <Pressable onPress={() => setShowDeleteModal(true)}>
                <AntDesign
                  name="delete"
                  size={20}
                  color="#F34E3A"
                  style={style.deletIcon}
                />
              </Pressable>
              <EditPlan id={id} planName={plan_name} amount={plan_amount} duration={plan_duration}    
               onPlanUpdate={onEdit} 
 />
            </View>
          </View>
          <Text style={style.amount}>{plan_duration} Days - ₹{plan_amount}</Text>
        </View>
      </View>

      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View style={style.modalOverlay}>
          <View style={style.modalContainer}>
            <Text style={style.modalTitle}>Delete Member</Text>
            <Text style={style.modalText}>
              Are you sure you want to delete {plan_name}?
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
    </View>
  );
};


export default Plan;

const style = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E6EA",
    margin: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    borderRadius: 5,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#B51C0C",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "bold",
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

  deletIcon: {
    bottom: 5,
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

  amount:{
   fontWeight:700
  },
  buttontext: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 18,
  },

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
