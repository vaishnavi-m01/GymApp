import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Searchbar } from "react-native-paper"
import config from "./config";
import axios from "axios";
import { Alert } from "react-native";
import LeadsMember from "./components/leads/LeadsMember";
import { useIsFocused } from "@react-navigation/native";


type Lead = {
    id: number;
    full_name: string;
    phone: string;
    referral: string;
    followup_date: string;
};

const PotentialLeads = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();
    const [leads, setLeads] = useState<Lead[]>([]);

   const isFocused = useIsFocused();
     useEffect(() => {
          if (isFocused) {
            fetchLeads();
          }
        }, [isFocused]);

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`${config.BASE_URL}/leads/`);
            setLeads(res.data.data);
        } catch (err) {
            Alert.alert("Error", "Failed to fetch leads.");
            console.error(err);
        }
    };


    const filteredLeads = leads.filter(lead =>
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search by name..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("Create Lead" as never)}
                >
                    <Text style={styles.addButtonText}> + </Text>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <LeadsMember
              key={lead.id}
              name={lead.full_name}
              phone={lead.phone}
              referral={lead.referral}
              followup_date={lead.followup_date}
            />
          ))
        ) : (
          <Text style={styles.noResults}>No leads found</Text>
        )}
      </ScrollView>
        </View>
    )
}

export default PotentialLeads

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#ffffff",
    },
    title: {
        paddingLeft: 25,
        fontWeight: "700",
        paddingTop: 20,
        fontSize: 20,
        fontFamily: "Jost",
    },
    header: {
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom:30
    },
    searchbar: {
        width: "70%",
        height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B1A18",
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 25,
        fontWeight: "700",
        color: "white",
    },
    noResults: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#999",
      },

})