import config from "@/app/config";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "expo-router";
import {
    Image,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
} from "react-native";


type members = {
    id?: number;
    profile_picture: string | number;
    name: string;
    phone_number: string;
    gender: string;
    status: string | undefined;
};

const ProfileMember = ({ profile_picture, name, phone_number, gender, status }: members) => {

    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    

    const handleIconClick = () => {
        if (id) {
            (navigation.navigate as Function)("Member Details", { id });
        } else {
          console.warn("Profile ID not found yet!");
        }
      };

    //   const handleIconClick = () => {
      
    //     if (id) {
    //       // Navigate to 'Member Details' page using router.push
    //       router.push(`/Member Details`, { id } as never);
    //     } else {
    //       console.warn("Profile ID not found yet!");
    //     }
    //   };
    
    return (
        <View style={style.container}>
                <View style={style.subcontainer}>
                    <Image
                        source={
                            typeof profile_picture === "string"
                                ? { uri: `${config.BASE_URL}/${profile_picture}` }
                                : profile_picture
                        }
                        style={style.image}
                    />
                    <View style={style.textContainer}>
                        <View style={style.numberNameRow}>
                            <Text style={style.name}>{name}</Text>
                            <View style={style.iconContainer}>
                                <TouchableOpacity onPress={handleIconClick}>
                                <AntDesign name="arrowright" size={22} color="black" />

                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={style.phoneNumber}>{phone_number}</Text>
                    </View>
                </View>

                <View style={style.bottomContainer}>
                    {status && (
                        <View style={style.statusContainer}>
                            <Entypo
                                name="dot-single"
                                size={25}
                                color={status === "Active" ? "#1daf60" : "#FFA500"}
                                style={style.dot}
                            />
                            <Text style={style.statusText}>{status}</Text>
                        </View>
                    )}
                    <Text style={style.plan}>{gender}</Text>
                </View>
        </View>
    );
};

export default ProfileMember;


const style = StyleSheet.create({
    container: {
        width: "100%",
        height: 160,
        backgroundColor: "#ffffff",
        borderWidth: 2,
        borderColor: "#E5E6EA",
        margin: 5,
        padding: 20,
        borderRadius: 13,
    },
    subcontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    numberNameRow: {
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 8,
    },

    name: {
        color: "#000000",
        fontFamily: "Jost",
        fontSize: 16,
        fontWeight: "bold",
    },
    phoneNumber: {
        color: "#555",
        fontSize: 14,
        marginTop: 2,
    },
    plan: {
        backgroundColor: "#eff0f4",
        marginTop: 20,
        borderRadius: 15,
        fontSize: 14,
        fontFamily: "Jost",
        padding: 10,
        fontWeight: "700",
        color: "black",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,

    },
    status: {
        padding: 10,
        marginTop: 10,
        borderRadius: 15,
        backgroundColor: "#E8F7F0",
        color: "black",
    },
    dot: {
        fontSize: 20,
    },
    statusContainer: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        backgroundColor: "#eff0f4",
        marginTop: 20,
        borderRadius: 15,
        fontFamily: "Jost",
        padding: 10,
        fontWeight: "700",
        color: "black",
    },
    iconContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: 8,
    },

    activeStatus: {
        backgroundColor: "#eff0f4",
        paddingRight: 5
    },
    inactiveStatus: {
        backgroundColor: "#eff0f4",
    },
    statusText: {
        fontWeight: "700",
        color: "black",
        alignItems: "center",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: "Jost",
        lineHeight: 30,
        paddingLeft: 10,
    },

});
