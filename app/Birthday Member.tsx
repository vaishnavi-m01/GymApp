import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import config from "./config";
import { useNavigation } from "@react-navigation/native";
import BirthdayMembers from "./components/birthdayMember/BirthDayMembers";

type Member = {
  id: number;
  name: string;
  profile_picture: string;
  phone_number: string;
};

const BirthdayMemberList = () => {
  const [birthdayMembers, setBirthdayMembers] = useState<Member[]>([]);

  // Directly using useNavigation with casting
  const navigation = useNavigation<any>(); // Cast to `any` type

  const handleFetchMembers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/birthdays/`);
      setBirthdayMembers(response.data.members);
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Could not fetch birthday members");
    }
  };

  useEffect(() => {
    handleFetchMembers();
  }, []);

  const handleClick = (id: number) => {
    // Decrease count when a member is clicked (call this function when needed)
    // decreaseBirthdayCount();

    // Navigate with id
    navigation.navigate("Member Details", { id }); // No type error now
    console.log("birthdayyyymemberid",id)

  };

  if (birthdayMembers.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No birthdays today.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={birthdayMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleClick(item.id)}>
            <BirthdayMembers
              name={item.name}
              profile_picture={`${config.BASE_URL}${item.profile_picture}`}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BirthdayMemberList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});
