import React, { useState, useEffect } from "react";
import {
  
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import { EvilIcons } from "@expo/vector-icons";
import config from "../config";
import TotalTransactions from "../components/transaction/TotalTransactions";

export default function App() {
  const [timeline, setTimeline] = useState("Today");
  const [paymentType, setPaymentType] = useState("All");

  const [timelineVisible, setTimelineVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);

  const [totalReceived, setTotalReceived] = useState(0);
  const [allTimeBalance, setAllTimeBalance] = useState(0);
  const [plansData, setPlansData] = useState([]);

  const timelineOptions = ["Today", "This Week", "This Month"];
  const paymentOptions = ["Cash", "UPI", "Card", "All"];

  useEffect(() => {
    fetchReportData();
  }, [timeline, paymentType]);
  

  const fetchReportData = async () => {
    try {
      let queryParams: string[] = [];
  
      // Timeline
      if (timeline === "Today") queryParams.push("today=true");
      else if (timeline === "This Week") queryParams.push("weekly=true");
      else if (timeline === "This Month") queryParams.push("monthly=true");
  
      // Payment Type
      if (paymentType !== "All") {
        queryParams.push(`payment_type=${paymentType.toLowerCase()}`);
      }
  
      // Build final URL
      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const response = await axios.get(`${config.BASE_URL}/report/${queryString}`);
  
      const data = response.data;
      setTotalReceived(data.total_received);
      setAllTimeBalance(data.all_time_balance);
      setPlansData(data.plans_data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  
  const renderOption = (option: any, setter: any, closeModal: any) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => {
        setter(option);
        closeModal(false);
      }}
    >
      <Text style={styles.optionText}>{option}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>

      <View style={styles.reportsContainer}>
        <Text style={styles.text}>Filter By</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setTimelineVisible(true)}
        >
          <Text style={styles.dropdownText}>
            Timeline: {timeline}{" "}
            <EvilIcons name="chevron-down" size={20} color="#FFFFFF" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setPaymentVisible(true)}
        >
          <Text style={styles.dropdownText}>
            Payment Type: {paymentType}{" "}
            <EvilIcons name="chevron-down" size={21} color="#FFFFFF" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subcontainer}>
        <View style={styles.totalAmountBox}>
          <Text style={styles.amountTitle}>Total received</Text>
          <Text style={styles.amount}>₹{totalReceived}</Text>
        </View>

        <View style={styles.blanceAmountBox}>
          <Text style={styles.blanceTitle}>All time balance</Text>
          <Text style={styles.blance}>₹{allTimeBalance}</Text>
        </View>
      </View>

      <ScrollView  showsVerticalScrollIndicator={false} style={styles.scrollViewContainer}>
        <Text style={styles.header}>Memberships by plan</Text>
        {plansData.map((item: any, index: number) => (
          <TotalTransactions
            key={index}
            id={index}
            plan={item.plan_name}
            amount={item.total_received}
            count={item.memberships}
          />
        ))}
      </ScrollView>

      <Modal transparent visible={timelineVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setTimelineVisible(false)}
        >
          <View style={styles.modalBox}>
            {timelineOptions.map((item) =>
              renderOption(item, setTimeline, setTimelineVisible)
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={paymentVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setPaymentVisible(false)}
        >
          <View style={styles.modalBoxPayment}>
            {paymentOptions.map((item) =>
              renderOption(item, setPaymentType, setPaymentVisible)
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    // padding: 30,
    paddingTop: 50,
    padding: 10,
    paddingLeft: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    fontFamily: "Jost",
    color: "#111827",
    fontWeight: 700,
    paddingTop: 30,
    paddingLeft: 12,
    fontSize: 18,
  },
  text: {
    fontFamily: "Jost",
    color: "#111827",
    fontWeight: 700,
    top: 6,
    fontSize: 14,
    paddingLeft: 10,
  },
  totalAmountBox: {
    width: "45%",
    borderColor: "#1B1A18",
    backgroundColor: "#1B1A18",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
  },
  amountTitle: {
    color: "#FFFFFF",
    fontWeight: 700,
    fontFamily: "Jost",
    textAlign: "left",
    paddingLeft: 10,
  },
  amount: {
    color: "#FFFFFF",
    fontWeight: 700,
    fontFamily: "Jost",
    textAlign: "left",
    fontSize: 18,
    paddingLeft: 19,
    top: 5,
    paddingBottom: 10,
  },
  blanceAmountBox: {
    width: "45%",
    borderColor: "#1B1A18",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 10,
  },
  blanceTitle: {
    color: "#1B1A18",
    fontWeight: 700,
    fontFamily: "Jost",
    textAlign: "left",
    paddingLeft: 10,
  },
  blance: {
    color: "#1B1A18",
    fontWeight: 700,
    fontFamily: "Jost",
    textAlign: "left",
    fontSize: 18,
    paddingLeft: 19,
    top: 5,
    paddingBottom: 10,
  },
  reportsContainer: {
    paddingTop: 20,
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-around",
  },
  subcontainer: {
    paddingTop: 40,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
  dropdown: {
    backgroundColor: "#000",
    // paddingHorizontal: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    paddingLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 110,
    paddingLeft: 100,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    width: "50%",
    marginHorizontal: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    marginTop: 25,
  },
  modalBoxPayment: {
    width: "40%",
    marginHorizontal: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 25,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
  },
  // icon:{
  //   bottom:19
  // }
  header: {
    fontFamily: "Jost",
    paddingTop: 50,
    paddingLeft: 10,
    fontWeight: 800,
    fontSize: 16,
    lineHeight: 20,
  },
  scrollViewContainer:{
    paddingBottom: 90,
  }
});
