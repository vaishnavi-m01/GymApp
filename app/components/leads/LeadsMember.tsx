import { View,StyleSheet, Text } from "react-native"

type leads= {
    name:string;
    phone:string;
    referral:string;
    followup_date: string;
}
const LeadsMember = ({name,phone,referral,followup_date}: leads) =>{
    return(
       <View style={styles.container}>
         <View style={styles.subContainer}>
             <View style={styles.leadsContainer}>
                 <Text>{name}</Text>
                 <Text>{referral}</Text>
             </View>
             <Text>{phone}</Text>
         </View>
       </View> 
    )
}

export default LeadsMember

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#FFFFFF",
        padding:10,
        paddingLeft:15
    },
    subContainer:{
     borderWidth:1,
     borderColor: "#B5B5B5",
     borderRadius:15,
     padding:10,
    },
    leadsContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        padding:5,
        display: "flex"
    }
})