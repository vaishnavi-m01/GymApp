import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Searchbar } from "react-native-paper";
import AttendancePage from "./components/attendance/AttendancePage";
import config from "./config";


type Member = {
  id: number;
  name: string;
  profile_picture: string | number;
  membership_status?: "Active" | "Inactive";
  attendance_status?: "Present" | "Absent" | null;
};

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"Attendance" | "Present" | "Absent">("Attendance");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isFocused = useIsFocused();

  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

  useEffect(() => {
    if (isFocused) {
      loadFromStorageOrFetch();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      fetchAttendance(formattedDate);
    }
  }, [selectedDate, isFocused]);

 

  const loadFromStorageOrFetch = async () => {
    const today = moment().format("YYYY-MM-DD");
    const savedDate = await AsyncStorage.getItem("attendanceDate");
    const savedData = await AsyncStorage.getItem("attendanceData");

    if (savedDate === today && savedData) {
      setMembers(JSON.parse(savedData));
    } else {
      fetchMembers();
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/members/`);
      const membersFromAPI = response.data.data;

      if (Array.isArray(membersFromAPI)) {
        const formattedMembers: Member[] = membersFromAPI.map((member: any) => ({
          id: member.id,
          name: member.name,
          profile_picture: member.profile_picture
            ? `${config.BASE_URL}${member.profile_picture}`
            : require("../assets/images/member2.png"),
          membership_status: member.status === "active" ? "Active" : "Inactive",
          attendance_status: null,
        }));

        setMembers(formattedMembers);
        await AsyncStorage.setItem("attendanceData", JSON.stringify(formattedMembers));
        await AsyncStorage.setItem("attendanceDate", formattedDate);

        // Fetch attendance after members are loaded
        fetchAttendance(formattedDate);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch members.");
    }
  };

  const fetchAttendance = async (date: string) => {
    try {
      const response = await axios.get(`${config.BASE_URL}/attendance?date=${date}`);
      const attendanceList = response.data.data;

      const updatedMembers = members.map((member) => {
        const matched = attendanceList.find((att: any) => att.member_id === member.id);
        return {
          ...member,
          attendance_status: matched?.status || null,
        };
      });

      setMembers(updatedMembers);
    } catch (error) {
      console.error("Attendance fetch error:", error);
    }
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleAttendance = async (memberId: number, newStatus: "Present" | "Absent") => {
    const updated = members.map((m) =>
      m.id === memberId ? { ...m, attendance_status: newStatus } : m
    );
    setMembers(updated);

    await AsyncStorage.setItem("attendanceData", JSON.stringify(updated));
    await AsyncStorage.setItem("attendanceDate", formattedDate);

    try {
      const response = await axios.post(`${config.BASE_URL}/attendance/`, {
        member: memberId,
        status: newStatus,
        date: formattedDate,
      });

      Alert.alert("Success", `${response.data?.member_name || "Member"} marked as ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "Error submitting attendance");
      console.error("Submit error:", error);
    }
  };

  const filteredData = members.filter((member) => {
    const matchesFilter = filter === "Attendance" || member.attendance_status === filter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.containers}>
      <Searchbar
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.buttons}>
        {["Attendance", "Present", "Absent"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.activeFilterButton]}
            onPress={() => setFilter(status as typeof filter)}
          >
            <Text style={[styles.filterButtonText, filter === status && styles.activeFilterButtonText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.header}>
        <Text style={styles.dateText}>{moment(selectedDate).format("dddd, D MMMM YYYY")}</Text>
        <TouchableOpacity onPress={showDatePicker}>
        <MaterialIcons name="calendar-today" size={25} color="#333" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => {
          resetToToday();
          hideDatePicker();
        }}
        date={selectedDate}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredData.length === 0 ? (
          <Text>No members to display</Text>
        ) : (
          filteredData.map((item) => (
            <AttendancePage
              key={item.id}
              id={item.id}
              image={typeof item.profile_picture === "string" ? { uri: item.profile_picture } : item.profile_picture}
              name={item.name}
              attendance_status={item.attendance_status}
              onAttendanceChange={handleAttendance}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  searchbar: {
    margin: 10,
    width: "95%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  buttons: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
    gap: 10,
  },
  filterButton: {
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    width: 100,
    borderColor: "#000000",
  },
  activeFilterButton: {
    backgroundColor: "#000000",
  },
  filterButtonText: {
    color: "#000000",
    fontSize: 12,
    textAlign: "center",
  },
  activeFilterButtonText: {
    color: "white",
  },
  dateText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
