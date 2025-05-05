import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import MembersPage from "../components/dahboard/MembersPage";
import config from "../config";
import { useIsFocused } from "@react-navigation/native";
import { useMember } from "../context/MemberContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";



export type RootStackParamList = {
  "Member Details": { id: string };
};


type Member = {
  id: number;
  name: string;
  profile_picture: string | number;
  phone_number: string;
  plan_name: string;
  status?: "Active" | "Inactive";
};

export default function MemberDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { member, setMember, removeMember } = useMember();
  const { id } = useLocalSearchParams();


  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isFocused = useIsFocused();


  useEffect(() => {
    if (isFocused) {
      fetchMembers();
    }
  }, [isFocused]);


  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/members/`);
      const membersFromAPI = response.data.data;

      if (Array.isArray(membersFromAPI)) {
        const formattedMembers: Member[] = membersFromAPI.map((member: any) => ({
          id: member.id,
          name: member.name,
          profile_picture:`${config.BASE_URL}${member.profile_picture}`,

          phone_number: member.phone_number || "N/A",
          email: member.email || "",
          date_of_birth: member.date_of_birth || "",
          gender: member.gender || "",
          blood_group: member.blood_group || "",
          address: member.address || "",
          notes: member.notes || "",
          plan_name: member.plan_name || "No Plan",
          status: member.status === "active" ? "Active" : "Inactive",
        }));

        setMembers(formattedMembers);

      } else {
        console.warn("Unexpected data format:", response.data);
        setMembers([]);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };




  const getFilteredMembers = () => {
    const query = searchQuery.toLowerCase();

    return members
      .filter((member) => filter === "All" || member.status === filter)
      .filter((member) =>
        member.name.toLowerCase().includes(query) ||
        member.phone_number.toLowerCase().includes(query) ||
        member.plan_name.toLowerCase().includes(query)
      );
  };

  useEffect(() => {
    if (isFocused) {
      fetchMembers(); 
    }
  }, [isFocused]);

  const handleDeleteMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };


  const handleClick = (id: number) => {
    navigation.navigate("Member Details", { id: Array.isArray(id) ? id[0] : id });
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>

      <View style={styles.header}>
        <Searchbar
          placeholder="Search.."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("New  Member" as never)}
        >
          <Text style={styles.addButtonText}> + </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        {["All", "Active", "Inactive"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(status as "All" | "Active" | "Inactive")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === status && styles.activeFilterButtonText,
              ]}
            >
              {status} Members
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="black" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.members}>
            Showing {getFilteredMembers().length} members
          </Text>

          {getFilteredMembers().length > 0 ? (
            getFilteredMembers().map((item) => (
              <TouchableOpacity key={item.id} onPress={() => handleClick(item.id)}>
                <MembersPage
                  key={item.id}
                  id={item.id}
                  profile_picture={item.profile_picture}
                  name={item.name}
                  phone_number={item.phone_number}
                  plan={item.plan_name}
                  status={item.status}
                  onDelete={handleDeleteMember}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No members found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#ffffff",
  },
  title: {
    paddingLeft: 25,
    fontWeight: "700",
    paddingTop: 20,
    fontSize: 20,
    fontFamily: "Jost",
  },
  header: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  searchbar: {
    width: "70%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1A18",
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  buttons: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  filterButton: {
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  activeFilterButton: {
    backgroundColor: "#000000",
  },
  filterButtonText: {
    color: "#000000",
    fontSize: 12,
  },
  activeFilterButtonText: {
    color: "white",
  },
  loader: {
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 90,
    // marginBottom: 30,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  scrollView: {
    marginBottom: 80,
  },
  members: {
    fontFamily: "Jost",
    color: "#000000",
    fontWeight: "900",
    paddingTop: 30,
    paddingLeft: 25,
    fontSize: 18,
    marginBottom: 10,
  },
});
