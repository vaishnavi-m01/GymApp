import { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import config from "./config";
import { useMember } from "./context/MemberContext";


type FormErrors = {
    name?: string;
    phone_number?: string;
    Refferal?: string;
    blood_group?: string;
};

const CreateLead = () => {
    const [full_name, setName] = useState("");
    const [phone, setPhoneNumber] = useState("");

    const [chance_of_joining, setChanceOfJoining] = useState("");
    const [referral, setRefferal] = useState();
    const [notes, setNotes] = useState("");

    const [date, setDate] = useState(new Date());
    const [isPickerVisible, setPickerVisible] = useState(false);

    const navigation = useNavigation();

    const { setMember } = useMember();


    const [errors, setErrors] = useState<FormErrors>({});

    const validateField = (field: string, value: string) => {
        let errorMessage = "";

        switch (field) {
            // case "name":
            //   if (!value.match(/^[A-Za-z ]+$/))
            //     errorMessage = "Invalid Name (Only letters allowed)";
            //   break;
            case "phone":
                if (!value.match(/^\d{10}$/))
                    errorMessage = "Phone number must be 10 digits";
                break;

            default:
                break;
        }

        return errorMessage;
    };

    const validateForm = () => {
        let newErrors: FormErrors = {
            name: validateField("name", full_name),
            phone_number: validateField("phone", phone),
            // email: validateField("email", email),
            // date_of_birth: validateField("dob", date_of_birth),
            // address: validateField("address", address),
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        setPickerVisible(false);
    };


    const formatDOBForBackend = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert("Validation Error", "Please fix errors before submitting.");
            return;
        }

        const requestData = {
            full_name,
            phone,
            referral,
            chance_of_joining,
            notes,
            followup_date: formatDOBForBackend(date),
        };

        try {
            const response = await axios.post(`${config.BASE_URL}/leads/`, requestData);

            const createdLead = response.data;
            setMember(createdLead);

            const successMessage = response.data?.message || "Lead created successfully!";

            Alert.alert("Success", successMessage);
            console.log("Submitted data:", requestData);

            navigation.navigate("Potential Leads" as never);
        } catch (error: any) {
            console.error("API Error:", error.response?.data || error.message);

            let errorMessage = "Failed to add member. Try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Alert.alert("Error", errorMessage);
        }
    }

    // const handleSubmit = () => {
    //     navigation.navigate("Potential Leads" as never);
    // }

    return (
        <ScrollView>
            <View style={styles.containers}>
                <View style={styles.subContainers}>
                    <Text style={styles.text}>
                        Full Name
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputbox}
                            placeholder="Enter name"
                            value={full_name}
                            onChangeText={(text) => {
                                setName(text);
                                setErrors({ ...errors, name: validateField("name", text) });
                            }}
                        />
                    </View>
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    <Text style={styles.text}>
                        Phone Number
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputbox}
                            placeholder="9895xxxxxx"
                            value={phone}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                setErrors({
                                    ...errors,
                                    phone_number: validateField("phone", text),
                                });
                            }}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                    {errors.phone_number && (
                        <Text style={styles.errorText}>{errors.phone_number}</Text>
                    )}


                    <Text style={styles.text}>Refferal </Text>
                    <View style={styles.BloodPickerContainer}>
                        <Picker
                            selectedValue={referral}
                            style={styles.inputbox}
                            onValueChange={(itemValue) => setRefferal(itemValue)}
                        >
                            <Picker.Item label="Walk-in" value="Walk-in" />
                            <Picker.Item label="Friend/Family" value="Friend/Family" />
                            <Picker.Item label="Online Ad" value="Online Ad" />
                            <Picker.Item label="Social Media" value="Social Media" />
                            <Picker.Item label="Existing Member" value="Existing Member" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>


                    <Text style={styles.text}>Chance of Joining </Text>
                    <View style={styles.BloodPickerContainer}>
                        <Picker
                            selectedValue={chance_of_joining}
                            style={styles.inputbox}
                            onValueChange={(itemValue) => setChanceOfJoining(itemValue)}
                        >
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="High" value="High" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="Low" value="Low" />
                            <Picker.Item label="Not Sure" value="Not Sure" />
                        </Picker>
                    </View>


                    <Text style={styles.text}>Notes</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Add some quick notes here"
                        multiline={true}
                        numberOfLines={6}
                        value={notes}
                        onChangeText={setNotes}
                    />


                    <Text style={styles.memberStartDateText}> Fllow Up Date</Text>
                    <Pressable
                        style={styles.inputWrapper}
                        onPress={() => setPickerVisible(true)}
                    >
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={date.toLocaleDateString()}
                            pointerEvents="none"
                        />
                        <Ionicons
                            name="calendar"
                            size={24}
                            color="#666"
                            style={styles.icon}
                        />
                    </Pressable>

                    <DateTimePickerModal
                        isVisible={isPickerVisible}
                        mode="date"
                        date={date}
                        minimumDate={new Date()}
                        onConfirm={handleConfirm}
                        onCancel={() => setPickerVisible(false)}
                    />


                    <TouchableOpacity style={styles.sumbitButton} onPress={handleSubmit}>
                        <Text style={styles.buttontext}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default CreateLead;

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f8f8f8",
    },
    subContainers: {
        backgroundColor: "#f8f8f8",
        elevation: 5,
        boxShadow: "#f8f8f8",
        shadowColor: "#f8f8f8",
        margin: 5,
    },
    text: {
        fontFamily: "Jost",
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 50,
        paddingLeft: 5,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: "100%",
        marginBottom: 10,
        paddingLeft: 5,
    },
    inputbox: {
        flex: 1,
        fontSize: 17,
        color: "#62707D",
        fontFamily: "Jost",
        fontWeight: 600,
        paddingLeft: 15,
    },
    phoneContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 5,
    },
    phoneinputContainer: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 6,
        width: "60%",
        marginBottom: 10,
    },
    pickerStyle: {
        width: "30%",
    },
    mainPickerContainer: {
        width: "90%",
        display: "flex",
        flexDirection: "row",
        gap: 3,
        marginRight: 20,
    },
    Numbertext: {
        fontFamily: "Jost",
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 50,
        marginRight: 75,
    },
    codeInputContainer: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 6,
        width: "25%",
        marginBottom: 10,
    },

    radioContainer: {
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        padding: 10,
        width: "100%",
    },
    radioRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 75,
        alignItems: "center",
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioText: {
        marginLeft: 5,
        fontSize: 14,
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        width: 150,
        alignSelf: "center",
        marginBottom: 10,
    },
    BloodPickerContainer: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        width: "100%",
        alignSelf: "center",
        marginBottom: 10,
    },
    codeInput: {
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        marginBottom: 10,
    },
    textArea: {
        height: 130,
        borderWidth: 1,
        borderColor: "#E0E5E9",
        borderRadius: 15,
        padding: 10,
        paddingLeft: 15,
        textAlignVertical: "top",
        color: "#62707D",
        gap: 2,
        marginBottom: 20,
    },

    notesText: {
        color: "#62707D",
        fontSize: 16,
    },
    sumbitButton: {
        backgroundColor: "#1B1A18",
        borderWidth: 1,
        borderRadius: 10,
        width: "100%",
        padding: 10,
        marginTop: 20,
        marginBottom: 30,
    },

    buttontext: {
        textAlign: "center",
        color: "#FFFFFF",
        fontWeight: 600,
        fontSize: 18,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 5,
    },
    memberStartDateText: {
        marginTop: 10,
        fontFamily: "Jost",
        fontWeight: 800,
        color: "#111827",
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },

});
