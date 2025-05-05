import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

const WelcomePage = () => {
    const router = useRouter();

    const handleRegister = () => {
        router.replace("login" as never);
    };
    return (
        <View style={style.container}>
            <Image source={require('@/assets/images/welcomeImg.jpg')} style={style.homeImg} />
            <Text style={style.title}>
                The path to living{'\n'}strong and healthy
            </Text>
            <TouchableOpacity style={style.button} onPress={handleRegister}>
                <Text style={style.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};
export default WelcomePage;

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#1b1a18"
    },
    homeImg: {
        alignSelf: 'center',
        marginTop: 10,
        height: 350,
        width: 350,
        textAlign: "center",
        marginBottom: 40,
    },
    title: {
        alignSelf: 'center',
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#ffffff",
        alignSelf: "center",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "bold",
    },
});
