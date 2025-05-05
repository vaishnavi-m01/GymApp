import { useEffect, useState } from "react";
import {  View, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import PendingListComponent from "./components/pendingList/PendingListComponent";
import axios from "axios";
import config from "./config";
import { format, parse } from "date-fns";
import { useNavigation } from "expo-router";


type Member = {
    id: number;
    profile_picture: string | number;
    member_name: string;
    duration: string;
    pending_amount: number;
};

const PendingList = () => {
    const [members, setMembers] = useState<Member[]>([]);
      const navigation = useNavigation<any>(); // Cast to `any` type
    


    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
          const response = await axios.get(`${config.BASE_URL}/memberships/pending/`);
          const pending = response.data.data;
      
          if (Array.isArray(pending)) {
            const updated = pending.map((item, index) => {
              let formattedDuration = item.duration;
      
              const [startStr, endStr] = item.duration.split(" - ");
      
              const start = parse(startStr, "dd/MM/yyyy", new Date());
              const end =
                endStr && endStr !== "None"
                  ? parse(endStr, "dd/MM/yyyy", new Date())
                  : null;
      
              // Format only if start is valid
              if (!isNaN(start.getTime())) {
                formattedDuration = `${format(start, "dd MMM yyyy")} - ${
                  end && !isNaN(end.getTime()) ? format(end, "dd MMM yyyy") : "Ongoing"
                }`;
              }
      
              return {
                ...item,
                id: index + 1,
                profile_picture: item.profile_picture.startsWith("http")
                  ? item.profile_picture
                  : `${config.BASE_URL}${item.profile_picture}`,
                duration: formattedDuration,
              };
            });
      
            setMembers(updated);
          } else {
            console.warn("Unexpected data format:", response.data);
            setMembers([]);
          }
        } catch (error) {
          console.error("Failed to fetch plans:", error);
        }
      };

      const handleClick = (id: number) => {
        console.log("pendingMember",id)

        navigation.navigate("Member Details", { id }); // No type error now
        console.log("pendingMember",id)
      
      }
    return (
        <View style={styles.containers}>
            {/* <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
            >
                {members.map((item) => (
                    <PendingListComponent
                        key={item.id}
                        id={item.id}
                        image={item.profile_picture}
                        name={item.member_name}
                        pendingAmount={item.pending_amount}
                        duration={item.duration}
                    />
                ))}
            </ScrollView> */}

            <FlatList
                    data={members}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleClick(item.id)}>
                        <PendingListComponent
                        key={item.id}
                        id={item.id}
                        image={item.profile_picture}
                        name={item.member_name}
                        pendingAmount={item.pending_amount}
                        duration={item.duration}
                    />
                      </TouchableOpacity>
                    )}
                  />
        </View>
    )
}


export default PendingList

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        padding: 10,
        paddingTop: 50,
        backgroundColor: "#ffffff"
    },
    scrollView: {
        marginBottom: 10,
    }
})