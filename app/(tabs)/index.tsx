import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dashboard from "../components/dahboard/Dashboard";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useIsFocused, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";

// Define your stack param types
type RootStackParamList = {
  Home: { updatedImage?: string };
  Profile: { id: string };
  "Birthday Member": { decreaseBirthdayCount: () => void };
  "Message Templates": undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const birthdayMemberNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();
  const isFocused = useIsFocused();

  const [profile_picture, setProfileImage] = useState<{ uri: string } | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [birthdayCount, setBirthdayCount] = useState(0);

  const { updatedImage } = route.params || {};

  useEffect(() => {
    if (updatedImage && typeof updatedImage === "string") {
      const newImage = { uri: updatedImage };
      setProfileImage(newImage);
      AsyncStorage.setItem("profileImage", updatedImage);
    }
  }, [updatedImage]);

  const loadStoredImage = async () => {
    const storedUri = await AsyncStorage.getItem("profileImage");
    if (storedUri) {
      setProfileImage({ uri: storedUri });
    }
  };

  const fetchProfileData = async () => {
    try {
      const storedId = await AsyncStorage.getItem("userId"); 
      if (storedId) {
        setId(storedId); // first store in state
  
        const response = await axios.get(`${config.BASE_URL}/profile/${storedId}`);
        const profile = response.data[0];
        if (profile) {
          if (!profile_picture) {
            setProfileImage({ uri: `${config.BASE_URL}${profile.profile_picture}` });
          }
        }
      } else {
        console.warn("No stored userId found in AsyncStorage!");
      }
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };
  

  useEffect(() => {
    if (isFocused) {
      loadStoredImage();
      fetchProfileData();
      fetchBirthdayCount();
    }
  }, [isFocused]);

  const handleClicks = () => {
    if (id) {
      navigation.navigate("Profile", { id });
    } else {
      console.warn("Profile ID not found yet!");
    }
  };
  

  const goToMessageTemplate = () => {
    setModalVisible(false);
    navigation.navigate("Message Templates");
  };

  const handleClick = () => {
    birthdayMemberNavigation.navigate("Birthday Member", {
      decreaseBirthdayCount: () => {
        setBirthdayCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      },
    });
  };
  

  const fetchBirthdayCount = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/birthdays/`);
      if (response.data && response.data.count !== undefined) {
        setBirthdayCount(response.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch birthday count", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.headerTitle}>Hi, Velladurai Pandian</Text>
          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
              <AntDesign name="setting" size={25} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClick} style={{ alignSelf: "flex-end", marginRight: 12, paddingTop: 3 }}>
              <Fontisto name="bell" size={26} color="black" />
              {birthdayCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{birthdayCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClicks}>
              <Image
                source={
                  profile_picture?.uri
                    ? { uri: profile_picture.uri }
                    : require("@/assets/images/adminImg.png")
                }
                style={styles.adminImg}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Dashboard</Text>
        <Dashboard />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <View style={styles.templaterow}>
                <Pressable onPress={goToMessageTemplate}>
                  <View style={styles.modalRow}>
                    <Feather name="message-circle" size={22} color="black" style={styles.modalIcon} />
                    <Text style={styles.modalItem}>Message Template</Text>
                  </View>
                </Pressable>
              </View>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: "#ffffff",
    paddingTop: 30,
  },
  subContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    paddingTop: 5,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Jost",
    fontWeight: "900",
    color: "#111827",
    letterSpacing: 0.43,
    top: 6,
  },
  adminImg: {
    height: 35,
    width: 35,
    borderRadius: 25,
    top: 3,
  },
  title: {
    paddingLeft: 20,
    fontFamily: "Jost",
    fontWeight: "700",
    color: "#111827",
    fontSize: 18,
    marginBottom: 30,
    paddingTop: 10,
  },
  icon: {
    padding: 5,
    marginLeft: 2,
    top: 5,
  },
  modalIcon: {
    marginRight: 3,
  },
  iconButton: {
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
  },
  templaterow: {
    display: "flex",
    flexDirection: "row",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
  },
  modalView: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalItem: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
    color: "#1E3A8A",
  },
  modalClose: {
    marginTop: 15,
    fontSize: 16,
    color: "#DC2626",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
