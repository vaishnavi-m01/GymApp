import axios from "axios";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import config from "./config";
import { useMember } from "./context/MemberContext";

const NewPlan = () => {
  const [plan_name, setPlanName] = useState("");
  const [plan_amount, setPlanAmount] = useState("");
  const [plan_duration, setDuratioin] = useState("");

  const navigation = useNavigation();
  const { setMember } = useMember();

  const handleClick = async () => {
    if (!plan_name || !plan_amount || !plan_duration) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${config.BASE_URL}/plan/create/`, {
        plan_name,
        plan_amount: Number(plan_amount),
        plan_duration,
      });

      const createdMember = response.data;
      setMember(createdMember);
      console.log("planResponse",createdMember)

      if (response.status === 201 || response.status === 200) {
        alert("Plan created successfully!");
        navigation.navigate("Add Membership" as never);
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating plan");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Plan Name</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputbox}
          onChangeText={setPlanName}
          value={plan_name}
          placeholder="Enter plan name"
        />
      </View>

      <Text style={styles.label}>Plan Amount</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter  amount"
          onChangeText={setPlanAmount}
          value={plan_amount}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Duration</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter duration "
          onChangeText={setDuratioin}
          value={plan_duration}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleClick}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    padding: 20,
    marginTop: 30,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "100%",
    marginBottom: 10,
  },
  label: {
    padding: 15,
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },
  inputbox: {
    flex: 1, // Takes up remaining space
    fontSize: 17,
    color: "#62707D",
    fontWeight: "400",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#1B1A18",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
});
