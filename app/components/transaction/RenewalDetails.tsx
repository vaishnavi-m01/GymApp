import { AntDesign, Entypo } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Home: { updatedImage?: string };
  Profile: { id: string };
  "Birthday Member": { decreaseBirthdayCount: () => void };
  "Member Details": { id: number };
  "Message Templates": undefined;
};

type MemberRenewal = {
    plan: string;
    renewal_due?: string;
};


const RenewalDetails = ({plan,renewal_due}:MemberRenewal) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id } = useLocalSearchParams();

  const handleClick = () => {
    if (id) {
      (navigation.replace as Function)("Add Membership", { id });
    } else {
      console.warn("Profile ID not found yet!");
    }
  };
  return (
    <View style={styles.membershipContainer}>
      <View style={styles.membershipSubContainer}>
        <Text style={styles.planText}>{plan}</Text>
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

          <Text>{renewal_due}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleClick}>
        <Text style={styles.buttonText}>Add Upcoming</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenewalDetails;

const styles = StyleSheet.create({
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
});
