import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Image, Text } from "react-native";
import { useState } from "react";

type members = {
  id: number;
  image: string | number;
  name: string;
  pendingAmount: number;
  duration: string;
};
const PendingListComponent = ({ image, name, duration,pendingAmount }: members) => {
  const [_changePassword, setChangePassword] = useState<any[]>([]);

 

  return (
    <View style={style.container}>
      <View style={style.subcontainer}>
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={style.image}
      />

        <View style={style.textContainer}>
          <View style={style.numberNameRow}>
            <Text style={style.name}>{name}</Text>
            <View style={style.iconContainer}>
              <View style={style.ReminderButton}>

              <Text style={style.buttonText}>₹{pendingAmount.toLocaleString("en-IN")}</Text>
              </View>
              <AntDesign name="right" size={19} color="#717171" style={style.arrowIcon} />

            </View>
          </View>
          <Text style={style.durationText}>Duration: {duration}</Text>
        </View>
      </View>


    </View>
  );
};

export default PendingListComponent;

const style = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E6EA",
    margin: 5,
    padding: 10,
    borderRadius: 400,
    marginBottom: 15
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
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
    paddingTop:10,
    fontWeight: "bold",
  },


  dot: {
    fontSize: 20,
  },

  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },

  icon: {
    width: 20,
    height:20
  },

  ReminderButton: {
  
    borderWidth: 1,
    borderColor: "#FFE7E4",
    backgroundColor: "#FFE7E4",
    padding: 5,
    width:80,
    gap: 10
  },
  buttonText:{
    color:"#666A75",
    alignSelf: "center"
  },
  arrowIcon:{
    bottom:5
  },
  durationText:{
    paddingTop:7,
    fontSize:12,
    color:"#73767D"
  }
});
