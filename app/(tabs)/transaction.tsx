import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from "react-native";
import Transactions from "../components/transaction/Transactions";
import axios from "axios";
import config from "../config";
import { useLocalSearchParams } from "expo-router";

type Member = {
  id: number;
  image: string; 
  name: string;
  amount: number;
  duration: string;
  plan: string;
  paymentType: string;
};

export default function Transaction() {
  const [datas, setDatas] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
    const { id } = useLocalSearchParams();
  
 console.log("transaction",id)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get(`${config.BASE_URL}/transactions/`);
        setDatas(data.map((item: any) => {
          // Format the date here
          const [year, month, day] = item.payment_date.split("-");
          const formattedDate = `${day}-${month}-${year}`;
  
          return {
            id: item.id,
            name: item.member_name,
            image: item.profile_picture
              ? { uri: `${config.BASE_URL}${item.profile_picture}` }
              : require("../../assets/images/member1.png"),
            plan: item.plan_name,
            amount: parseFloat(item.amount_paid),
            duration: formattedDate,
            paymentType: item.payment_method,
          };
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, []);
  

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Transaction</Text>

        {datas.map((item) => (
          <Transactions
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            amount={item.amount}
            plan={item.plan}
            duration={item.duration}
            paymentType={item.paymentType}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 10,
    paddingTop: 50,
    marginBottom: 60,
  },
  title: {
    padding: 10,
    fontWeight: "800",
    lineHeight: 50,
    fontSize: 20,
    paddingTop: 30,
    paddingLeft: 18,
  },
});
