import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import ChangePassword from "./components/dahboard/ChangePassword";
import config from "./config";

type ImageFile = {
  uri: string;
};

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const route = useRoute();
  const { id } = route.params as { id: string };

  useEffect(() => {
    fetchProfile();
  }, [id]);


  const fetchProfile = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (!id) {
        console.error("No user ID found!");
        return;
      }
  
      const response = await axios.get(`${config.BASE_URL}/profile/${id}`);
      const { name, email, phone_number, profile_picture } = response.data;
  
      setName(name);
      setEmail(email);
      setPhone(phone_number);
  
      if (profile_picture) {
        // const base = config.BASE_URL.replace(/\/$/, "");
        const imageUrl = "https://reiosglobal.com" ;
        setProfileImage({ uri: `${imageUrl}${profile_picture}` });
      }
  
      console.log("Profile fetched successfully", profile_picture);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  // Example: useEffect to call fetchProfile when screen loads
  useEffect(() => {
    fetchProfile();
  }, []);

  console.log("statee", profileImage);

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
    }
    console.log("selectedImge", profileImage);
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
      const name = uri.split("/").pop();

      setProfileImage({ uri });
    }
  };

 

  const handleSubmit = async () => {
    try {
     
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone_number", phone_number);

      if (profileImage?.uri) {
        const uri = profileImage.uri;
        const fileName = uri.split("/").pop() || `profile_${Date.now()}.jpg`;
        const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

        const imageFile = {
          uri,
          name: fileName,
          type: fileType,
        };

        formData.append("profile_picture", imageFile as any);
      }

      console.log("Submitting picture:", profileImage);

      const response = await axios.put(
        `${config.BASE_URL}/profile/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Success:", response.data);
      ToastAndroid.show("Profile successfully updated!", ToastAndroid.SHORT);

      router.push({
        pathname: "/(tabs)",
        params: {
          updatedImage: profileImage?.uri,
        },
      });

      fetchProfile();
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);
      ToastAndroid.show("Upload failed!", ToastAndroid.SHORT);
    }
  };

  console.log("picture", profileImage);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.containers}>
        <View style={styles.profileContainer}>
        {profileImage?.uri && (
  <Image
    source={{ uri: profileImage.uri }}
    style={styles.adminImg}
  />
)}

          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MaterialIcons name="photo-camera" size={24} color="white" />
          </TouchableOpacity>

          {showOptions && (
            <View style={styles.optionBox}>
              <TouchableOpacity
                onPress={pickImageFromGallery}
                style={styles.optionButton}
              >
                <MaterialIcons name="photo-library" size={20} color="black" />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImageFromCamera}
                style={styles.optionButton}
              >
                <MaterialIcons name="camera-alt" size={20} color="black" />
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.loginText}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputbox}
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.loginText}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputbox}
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.loginText}>Phone</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputbox}
            placeholderTextColor="gray"
            value={phone_number}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
        </View>
        <ChangePassword></ChangePassword>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 15,
  },
  profileContainer: {
    alignSelf: "center",
    position: "relative",
  },
  adminImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#76789b",
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
  loginText: {
    color: "black",
    paddingLeft: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "800",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 6,
    width: "85%",
    marginLeft: 30,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputbox: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#1b1a18",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "60%",
    marginBottom: 90,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
