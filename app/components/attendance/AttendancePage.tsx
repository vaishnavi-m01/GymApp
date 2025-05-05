import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AttendancePageProps = {
  id: number;
  image: any;
  name: string;
  membership_status?: "Active" | "Inactive";
  attendance_status?: "Present" | "Absent" | null;
  onAttendanceChange: (id: number, status: "Present" | "Absent") => void;
};

const AttendancePage: React.FC<AttendancePageProps> = ({
  id,
  image,
  name,
  membership_status,
  attendance_status,
  onAttendanceChange,
}) => {
  const [currentStatus, setCurrentStatus] = useState<"Present" | "Absent" | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const todayKey = `attendance_${id}_${new Date().toISOString().split("T")[0]}`;

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(todayKey);
        if (savedStatus === "Present" || savedStatus === "Absent") {
          setCurrentStatus(savedStatus);
        }

        const now = moment();
        const cutoff = moment().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
        if (now.isAfter(cutoff)) {
          setIsButtonDisabled(true);
        }
      } catch (error) {
        console.error("Error loading attendance status", error);
      }
    };

    loadStatus();
  }, []);

  const handleAttendance = async (newStatus: "Present" | "Absent") => {
    if (currentStatus) return; // Prevent re-marking

    try {
      await AsyncStorage.setItem(todayKey, newStatus);
      setCurrentStatus(newStatus);
      onAttendanceChange(id, newStatus);
    } catch (error) {
      console.error("Error saving attendance", error);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            disabled={isButtonDisabled || currentStatus !== null}
            style={[
              styles.button,
              currentStatus === "Present" ? styles.activePresent : styles.inactiveButton,
              (isButtonDisabled || currentStatus !== null) && styles.disabledButton,
            ]}
            onPress={() => handleAttendance("Present")}
          >
            <Text style={styles.buttonText}>
              {currentStatus === "Present" ? "Marked Present" : "Present"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isButtonDisabled || currentStatus !== null}
            style={[
              styles.button,
              currentStatus === "Absent" ? styles.activeAbsent : styles.inactiveButton,
              (isButtonDisabled || currentStatus !== null) && styles.disabledButton,
            ]}
            onPress={() => handleAttendance("Absent")}
          >
            <Text style={styles.buttonText}>
              {currentStatus === "Absent" ? "Marked Absent" : "Absent"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AttendancePage;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E6EA",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  activePresent: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  activeAbsent: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  inactiveButton: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
