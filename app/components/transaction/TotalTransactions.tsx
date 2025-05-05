import { View,StyleSheet,Text } from "react-native"

type Transaction= {
   id:number;
   plan: string;
   count: number;
   amount: number;
}
const TotalTransactions = ({plan,count,amount}: Transaction) =>{
    return(
       
        <View style={styles.container}>
            <View style={styles.subcontainer}>
               <Text style={styles.plan}>{plan}</Text>
               <View style={styles.bottomContainer}>
                    <Text>Total from {count} membership</Text>
                    <Text style={styles.amount}>  ₹{amount}</Text>
               </View>
            </View>
         
        </View>
    )

}

export default TotalTransactions


const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:20
    },
    subcontainer:{
        borderWidth: 1,
        borderColor:"#B5B5B5",
        borderRadius:15,
        marginLeft:8,
        marginRight:8,
        padding:10
    },
    plan:{
     fontFamily: "Jost",
     color: "#1B1A18",
     fontSize:16,
     fontWeight:700
    },
    bottomContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop:20
    },
    amount:{
        fontFamily: "Jost",
        fontWeight: 700,
        fontSize:16,
        paddingRight:12
    }
})