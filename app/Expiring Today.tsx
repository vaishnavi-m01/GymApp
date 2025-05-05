import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import ExpiringDays from "./components/expiringDay/ExpiringDays";
import config from "./config";

type Member = {
  id: number;
  profile_picture: string;
  member_name: string;
  duration: string;
  member_phone:string;
  plan:string;
  end_date:string;
};

const ExpiringDay = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const navigation = useNavigation<any>();
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    const fetchExpiringMembers = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/membership/expiring-today/`);
        const data = response.data.data;
        const formatted = data
        .filter((item: any) => item.id !== undefined)
        .map((item: any) => ({
          id: item.id,
          profile_picture: item.profile_picture.startsWith("http")
            ? item.profile_picture
            : `${config.BASE_URL}${item.profile_picture}`,
          member_name: item.member_name,
          duration: item.duration,
          member_phone: item.member_phone,
          plan: item.plan,
          end_date: item.end_date,
        }));
      
    
        setMembers(formatted);
    } catch (error) {
        console.error("Failed to fetch expiring members:", error);
      }
    };

    fetchExpiringMembers();
  }, []);


  const handleClick = (id: number) => {
    navigation.navigate("Member Details", { id }); 
    console.log("expiringggg",id)
  };

  return (
    <View style={styles.containers}>
      {/* <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {members.map((item) => (
          <ExpiringDays
            key={item.id}
            id={item.id}
            image={item.profile_picture} 
            name={item.member_name}
            duration={item.duration}
          />
        ))}
      </ScrollView> */}

      <FlatList
        data={members}
        style={styles.scrollView}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleClick(item.id)}>
           <ExpiringDays
            key={item.id}
            id={item.id}
            image={item.profile_picture} 
            name={item.member_name}
            duration={item.duration}
            member_phone={item.member_phone}
            plan={item.plan}
            end_date={item.end_date}
          />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ExpiringDay;

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    marginBottom: 10,
  },
});
