import config from "@/app/config";
import { useMember } from "@/app/context/MemberContext";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
  ToastAndroid,
  Image,
  Pressable,
} from "react-native";
import { RadioButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import moment from "moment";

// type EditMembersProps = {
//   onChangePassword: (data: any) => void;
// };

type EditMembersProps = {
  id: number;
  visible: boolean;
  onClose: () => void;
};

export default function EditMembers({
  id,
  visible,
}: EditMembersProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone_number, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date_of_birth, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [blood_group, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [showOptions, setShowOptions] = useState(false);
  const [isImagePicked, setIsImagePicked] = useState(false);
  const [isDOBPickerVisible, setDOBPickerVisible] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [joining_date, setJoinedDate] = useState("");

  const { setMember } = useMember();
  const navigation = useNavigation();

  const route = useRoute();
  // const { id } = route.params as { id: string };

  const [profile_picture, setProfileImage] = useState<any>(
    require("../../../assets/images/member2.png")
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (open) {
          setOpen(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [open]);

  console.log("meberId", id);

  useEffect(() => {
    if (id) {
      fetchMemberData();
    }
  }, [visible]);

  const fetchMemberData = async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${config.BASE_URL}/members/${id}/`);
      const data = res.data.data; // <-- Corrected here

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone_number || "");
      setDOB(data.date_of_birth?.split("-").reverse().join("-") || "");
      setGender(data.gender || "Male");
      setBloodGroup(data.blood_group || "");
      setAddress(data.address || "");
      setNotes(data.notes || "");
      setCity(data.city || "");
      setPincode(data.pincode || "");
      

      if (data.profile_picture) {
        setProfileImage({ uri: `${config.BASE_URL}${data.profile_picture}` }); // include full URL
      }
    } catch (err) {
      console.log("Fetch member failed:", err);
      ToastAndroid.show("Failed to load member data", ToastAndroid.SHORT);
    }
  };

  const pickImageFromGallery = async () => {
    setShowOptions(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      setProfileImage({ uri: asset.uri });
      setIsImagePicked(true);
    }
  };

  const pickImageFromCamera = async () => {
    setShowOptions(false);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;

      setProfileImage({ uri: asset.uri });
      setIsImagePicked(true);
    }
  };

  const formatDOBForBackend = (dob: string) => {
    if (!dob) return "";
    const [dd, mm, yyyy] = dob.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (phone_number) formData.append("phone_number", phone_number);
    if (email) formData.append("email", email);
    if (date_of_birth) {
      formData.append("date_of_birth", formatDOBForBackend(date_of_birth));
    }
    if (city) formData.append("city", city);
    if (pincode) formData.append("pincode", pincode);
    if (joining_date) formData.append("joining_date", joining_date);
    if (blood_group) formData.append("blood_group", blood_group);
    if (gender) formData.append("gender", gender);
    if (address) formData.append("address", address);
    if (notes) formData.append("notes", notes);

    if (profile_picture?.uri) {
      const uri = profile_picture.uri;
      const fileName = uri.split("/").pop() || `profile_${Date.now()}.jpg`;
      const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

      const imageFile = {
        uri,
        name: fileName,
        type: fileType,
      };

      formData.append("profile_picture", imageFile as any);
    }

    try {
      const response = await axios.put(
        `${config.BASE_URL}/members/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const updateData = response.data;
      setMember(updateData); 
      console.log("updatedData", updateData);
  
      ToastAndroid.show("Profile successfully updated!", ToastAndroid.SHORT);
  
      navigation.navigate("memberdashboard" as never);

    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);
      ToastAndroid.show("Upload failed!", ToastAndroid.SHORT);
    }
  };


  const handleDOBConfirm = (date: any) => {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    setDOB(formattedDate);
    setDOBPickerVisible(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setPickerVisible(false);
    setDate(selectedDate);

    const formatted = selectedDate.toISOString().split("T")[0]; // e.g., "2025-04-21"
    setJoinedDate(formatted);
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setOpen(true);
            fetchMemberData();
          }}
        >
          <FontAwesome5 name="edit" size={20} color="#1230B4" />
        </TouchableOpacity>

        <Modal visible={open} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Cancel (X) Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOpen(false)}
              >
                <FontAwesome5 name="times" size={20} color="black" />
              </TouchableOpacity>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.titleLabel}>Edit Member</Text>
                <View style={styles.profileContainer}>
                  <Image source={profile_picture} style={styles.adminImg} />
                  <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={() => setShowOptions(!showOptions)}
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

                  {showOptions && (
                    <View style={styles.optionBox}>
                      <TouchableOpacity
                        onPress={pickImageFromGallery}
                        style={styles.optionButton}
                      >
                        <MaterialIcons
                          name="photo-library"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.optionText}>Gallery</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={pickImageFromCamera}
                        style={styles.optionButton}
                      >
                        <MaterialIcons
                          name="camera-alt"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.optionText}>Take Photo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.label}>
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={setName}
                />
                <Text style={styles.label}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="9895xxxxxx"
                  value={phone_number}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                  maxLength={10} // Ensure only 10 digits
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.text}>Date of Birth</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.inputbox, { flex: 1 }]}
                    placeholder="DD-MM-YYYY"
                    value={date_of_birth}
                    editable={false}
                  />
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color="#888"
                    style={{ marginLeft: 8, paddingTop: 10 }}
                    onPress={() => setDOBPickerVisible(true)}
                  />
                </View>
                <DateTimePickerModal
                  isVisible={isDOBPickerVisible}
                  mode="date"
                  onConfirm={handleDOBConfirm}
                  onCancel={() => setDOBPickerVisible(false)}
                />

                <Text style={styles.text}>Gender (Required)</Text>
                <View style={styles.radioContainer}>
                  <RadioButton.Group onValueChange={setGender} value={gender}>
                    <View style={styles.radioRow}>
                      <View style={styles.radioButton}>
                        <RadioButton value="Male" />
                        <Text style={styles.radioText}>MALE</Text>
                      </View>
                      <View style={styles.radioButton}>
                        <RadioButton value="Female" />
                        <Text style={styles.radioText}>FEMALE</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>

                <Text style={styles.text}>Blood Group</Text>
                <View style={styles.BloodPickerContainer}>
                  <Picker
                    selectedValue={blood_group}
                    style={styles.inputbox}
                    onValueChange={(itemValue) => setBloodGroup(itemValue)}
                  >
                    <Picker.Item label="Please select" value="" />
                    <Picker.Item label="A+" value="A+" />
                    <Picker.Item label="A-" value="A-" />
                    <Picker.Item label="B+" value="B+" />
                    <Picker.Item label="B-" value="B-" />
                    <Picker.Item label="O+" value="O+" />
                    <Picker.Item label="O-" value="O-" />
                    <Picker.Item label="AB+" value="AB+" />
                    <Picker.Item label="AB-" value="AB-" />
                  </Picker>
                </View>

                <Text style={styles.text}>City</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputbox}
                    placeholder="Enter city"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <Text style={styles.text}>Pincode</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputbox}
                    placeholder="Enter pincode"
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>

                <Text style={styles.text}> Joining date</Text>
                <Pressable
                  style={styles.inputWrapper}
                  onPress={() => setPickerVisible(true)}
                >
                  <TextInput
                    style={styles.dateinput}
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
                  // minimumDate={new Date()}
                  onConfirm={handleConfirm}
                  onCancel={() => setPickerVisible(false)}
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter address"
                  multiline
                  value={address}
                  onChangeText={setAddress}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Update Details</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Toast />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  button: { padding: 5, top: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileContainer: {
    alignSelf: "center",
    position: "relative",
  },
  adminImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "#E0E5E9",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "black",
    padding: 5,
    borderRadius: 20,
  },
  optionBox: {
    position: "absolute",
    bottom: -50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  optionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "black",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    width: "90%",
    position: "relative",
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  mainPickerContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    gap: 3,
    marginRight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    width: 120,
    alignSelf: "center",
    marginBottom: 10,
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
  text: {
    fontFamily: "Jost",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 50,
  },
  BloodPickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    width: "100%",
    alignSelf: "center",
    marginBottom: 10,
  },
  inputbox: {
    flex: 1,
    fontSize: 17,
    color: "#62707D",
    fontFamily: "Jost",
    fontWeight: 600,
    paddingLeft: 15,
  },
  required: {
    color: "red",
    fontSize: 16,
  },
  cancelButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E0E5E9",
    borderRadius: 15,
    alignSelf: "center",
    marginBottom: 10,
  },
  picker: {
    width: 120,
  },
  phoneInput: {
    flex: 1,
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
  radioButton: { flexDirection: "row", alignItems: "center" },
  radioText: { marginLeft: 5, fontSize: 14 },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#1B1A18",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16 },
  errorText: { color: "red", fontSize: 14, marginBottom: 5 },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E5E9",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "100%",
    marginBottom: 10,
  },
  memberStartDateText: {
    marginTop: 30,
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
    paddingVertical: 8,
    marginBottom:20
  },
  icon: {
    marginLeft: 10,
  },
  dateinput:{
    flex: 1,
    fontSize: 16,

  }
});
