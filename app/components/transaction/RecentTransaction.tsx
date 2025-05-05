import { StyleSheet, Text, View } from "react-native";

type transaction={
  planName: string;
  paymentType:string;
  amount:string;
  paymentDate: string;
}
const RecentTransaction = ({planName,paymentType,amount,paymentDate}: transaction) =>{
    return(
        <View style={styles.transactionContainer}>
                 <View style={styles.transactionSubContainer}>
                   <Text style={styles.title}>{planName}</Text>
       
                   <View style={styles.rightContainer}>
                     <Text style={styles.payementType}>{paymentType}</Text>
                     <Text style={styles.amountText}>{amount}</Text>
                   </View>
                 </View>
                 <View style={styles.rightContainer}>
                   <Text style={styles.durationText}>
                    {paymentDate}
                   </Text>
                 </View>
               </View>
    )
}

export default RecentTransaction

const styles = StyleSheet.create({

    transactionContainer: {
        margin: 10,
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        padding: 10,
        width: "90%",
      },
      transactionSubContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
      },
      title: {
        fontFamily: "Jost",
        fontWeight: 600,
        fontSize: 15,
        color: "#111827",
      },
      payementType: {
        borderWidth: 1,
        borderColor: "#E3E4E8",
        backgroundColor: "#E3E4E8",
        borderRadius: 15,
        width: 50,
        padding: 1,
        color: "#090A0E",
        textAlign: "center",
        fontWeight: 700,
      },
      rightContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
      },
      amountText: {
        fontSize: 16,
        fontWeight: 700,
        paddingTop: 0,
      },
      durationText: {
        padding: 10,
        paddingBottom: 3,
        color: "#666A75",
      },

})