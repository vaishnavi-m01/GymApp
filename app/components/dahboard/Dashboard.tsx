import config from "@/app/config";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios"; // if you use axios
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Dashboard = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${config.BASE_URL}/dashboard/`);
            const data = response.data;

            const formattedData = [
                { key: "total_members", image: require("../../../assets/images/totalMembers.png"), title: "Total Members", count: data.total_members },
                { key: "attendance_today", image: require("../../../assets/images/Attendance.png"), title: "Attendance", count: data.attendance_today },
                { key: "expiring_today", image: require("../../../assets/images/leads.png"), title: "Expiring Today", count: data.expiring_today },
                { key: "pending_list", image: require("../../../assets/images/leads.png"), title: "Pending List", count: data.pending_list },
                { key: "leads_count", image: require("../../../assets/images/leads.png"), title: "Leads", count: data.leads_count },
                // { key: "birthday_members", image: require("../../../assets/images/leads.png"), title: "Birthday Members", count: data.birthday_members },
            ];

            setDashboardData(formattedData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImgClick = (key: string) => {
        switch (key) {
            case "total_members":
                router.push("/memberdashboard"
                    
                );
                break;
            case "attendance_today":
                navigation.navigate("Attendance" as never);
                break;
            case "expiring_today":
                navigation.navigate("Expiring Today" as never);
                break;
            case "pending_list":
                navigation.navigate("Pending List" as never);
                break;
            case "leads_count":
                navigation.navigate("Potential Leads" as never);
                break;
            case "birthday_members":
                navigation.navigate("Birthday Members" as never);
                break;
            default:
                console.warn("No screen available for this section.");
        }
    };

    return (
        <View style={styles.container}>
            {dashboardData.map((item) => (
                <View style={styles.cardContainer} key={item.key}>
                    <TouchableOpacity style={styles.touchable} onPress={() => handleImgClick(item.key)}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.text}>{item.count}</Text>
                        <AntDesign name="right" size={18} color="gray" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    touchable: {
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-evenly", 
        width: "100%",
    },
    cardContainer: {
        display: "flex",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 12,
        width: '90%',
        marginLeft: 20,
        marginBottom: 20,
        backgroundColor: 'black',
    },
    image: {
        paddingLeft: 10,
        height: 50,
        width: 50,
    },
    text: {
        fontSize: 16,
        fontFamily: "Jost",
        fontWeight: "900",
        color: "#FFFFFF"
    }
})
