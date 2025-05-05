import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Text, Image } from "react-native";

type members = {
  id: number;
  image: string;
  name: string;
  amount: number;
  duration: string;
  plan: string;
  paymentType: string;
};
const Transactions = ({
  id,
  image,
  name,
  amount,
  duration,
  paymentType,
  plan
}: members) => {
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
              {/* <AntDesign
                name="delete"
                size={20}
                color="#F34E3A"
                style={style.deletIcon}
              /> */}
              <Text
                style={[
                  style.paymentType,
                  {
                    backgroundColor: paymentType === "Cash" ? "#D5F1E3" : "#E3E4E8",
                    borderColor: paymentType === "Cash" ? "#D5F1E3" : "#E3E4E8",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }
                ]}
              >
                {paymentType}
              </Text>
              <Text style={style.amount}>₹{amount.toLocaleString("en-IN")}</Text>
            </View>
          </View>
          <Text style={style.duration}>PaymentDate: {duration}</Text>
        </View>
      </View>
      <Text style={style.bottomLine}></Text>
      <View style={style.bottomContainer}>
         <Text style={style.plan}>{plan}</Text>
         <AntDesign name="right" size={18} color="#000000" style={style.arrowIocn}/>

      </View>

    </View>
  );
};

export default Transactions;

const style = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E6EA",
    margin: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    borderRadius: 15,
  },
  subcontainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
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
    fontWeight: "bold",
    alignSelf: "center"
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

  deletIcon: {
    bottom: 5,
  },

  duration: {
    color: "#73767D",
    fontFamily:"Jost",

  },
  plan:{
   fontFamily: "Jost",
   fontWeight: 700,
   fontSize:15
  },
  arrowIocn:{
   fontWeight:900,
   color: "#000000"
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
  paymentType: {
    borderWidth: 1,
    borderColor: "#D5F1E3",
    backgroundColor: "#D5F1E3",
    borderRadius: 20,
    padding: 5,
    width: 80,
    color: "#0F2519",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 8
  },
  amount: {
    color: "#1B1A18",
    fontFamily: "Jost",
    fontWeight: 700,
    bottom: 13
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#73767D",
    // paddingBottom: 8, 
    width: "100%"
  },
  bottomContainer:{
    display: "flex",
    flexDirection:"row",
    justifyContent: "space-between",
    margin:5,
    padding:5,
    paddingTop: 10
  }

});
