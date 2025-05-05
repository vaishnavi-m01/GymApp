import { useNavigation } from "expo-router"
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native"

const MessageTemplates = () => {
    
    const navigation = useNavigation();
    const handleClick = () =>{
        navigation.navigate("Membership Expired" as never)
    }

    const birthdayNavigation = useNavigation();
    const handleBirthDay = ()=>{
        birthdayNavigation.navigate("Birthday Template" as never)
    }

    const memberOnboarding = useNavigation();
    const handleOnboarding = () =>{
        memberOnboarding.navigate("Member onboarding" as never)

    }
    return (
        <ScrollView>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleClick}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Membership expired</Text>
                    <Text style={styles.messageTitle}>The message for Membership expired</Text>
                    <Text style={styles.bottomLine}></Text>
                    <Text style={styles.date}>Updated On 21 Dec 2024</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOnboarding}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Member onboarding</Text>
                    <Text style={styles.messageTitle}> message for Member onboarding</Text>
                    <Text style={styles.bottomLine}></Text>
                    <Text style={styles.date}>Updated On 21 Dec 2024</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Member settlement success</Text>
                    <Text style={styles.messageTitle}>Message sent to member when balance is paid off </Text>
                    <Text style={styles.bottomLine}></Text>
                    <Text style={styles.date}>Updated On 21 Dec 2024</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={handleBirthDay}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Member birthday message</Text>
                    <Text style={styles.messageTitle}>Message sent to member on their birthday
                    </Text>
                    <Text style={styles.bottomLine}></Text>
                    <Text style={styles.date}>Updated On 21 Dec 2024</Text>
                </View>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}

export default MessageTemplates


const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    subContainer: {
        width: "95%",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#E5E6EA",
        margin: 8,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        borderRadius: 15,
    },
    bottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E6EA",
        // paddingBottom: 8, 
        width: "100%"
    },
    title:{
        fontFamily: "Jost",
        fontWeight:800,
        lineHeight:40,
        fontSize:16
    },
    messageTitle:{
        fontFamily: "Jost",
        fontWeight:600,   
    },
    date:{
        paddingTop:20,
        fontFamily:"Jost",
        fontWeight:600
    }
})