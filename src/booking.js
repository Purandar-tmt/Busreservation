import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet ,FlatList,Text,ScrollView} from "react-native";
import { CustomButton } from "./components/customButton";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "../config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from "firebase/firestore";

export const Booking = () => {
  const navigate = useNavigation();
  const [bookSeat, setBookSeat] = useState(false);
  const [cancelSeat, setCancelSeat] = useState(false);
  const [checkSeat, setCheckSeat] = useState(false);

  const [busNumber, setBusNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [passengerDetails, setPassengerDetails] = useState("");
  const [departureTime, setDepartureTime] = useState("");  
  const [bookingId, setBookingId] = useState("");  
  const[bookList,setBookList]=useState([])
  const[busList,setBusList]=useState([])

  const [showDatePicker, setShowDatePicker] = useState(false);  

  const handleBook = () => {
    setBookSeat(!bookSeat);
    setCancelSeat(false);
    setCheckSeat(false);
  };

  const handleCancel = () => {
    setCancelSeat(!cancelSeat);
    setCheckSeat(false);
    setBookSeat(false);
  };

  const handleCheckSeat = () => {
    setCheckSeat(!checkSeat);
    setCancelSeat(false);
    setBookSeat(false);
  };

  const handleExitSystem = () => {
    
    navigate.navigate("home");
  };

  // Book a Seat
  // const handleBookSeat = async () => {
  //   if (busNumber && seatNumber && passengerDetails && departureTime) {
  //     try {
  //       // const busQuery = query(
  //       //   collection(firestore, "Buses"),
  //       //   where("bus_number", "==", busNumber)
  //       // );
  //       // const busSnapshot = await getDocs(busQuery);

  //       // if (busSnapshot.empty) {
  //       //   Alert.alert("Error", "No bus found with this number.");
  //       //   return;
  //       // }

  //       // const busDoc = busSnapshot.docs[0];
  //       // const busId = busDoc.id;
  //       // const availableSeats = busDoc.data().available_seats;

  //       // if (availableSeats <= 0) {
  //       //   Alert.alert("Error", "No available seats for this bus.");
  //       //   return;
  //       // }

  //       // // Check if the seat is already booked
  //       // const bookingQuery = query(
  //       //   collection(firestore, "Bookings"),
  //       //   where("bus_id", "==", busId),
  //       //   where("seat_number", "==", seatNumber)
  //       // );
  //       // const bookingSnapshot = await getDocs(bookingQuery);

  //       // if (!bookingSnapshot.empty) {
  //       //   Alert.alert("Error", "This seat is already booked.");
  //       //   return;
  //       // }

  //       // // Update the available seats on bus
  //       // await updateDoc(doc(firestore, "Buses", busId), {
  //       //   available_seats: availableSeats - 1,
  //       // });

        
  //     //   await addDoc(collection(firestore, "Bookings"), {
  //     //     booking_id: `BOOK-${Date.now()}`, 
  //     //     bus_id: busId,  
  //     //     seat_number: seatNumber,
  //     //     passenger_name: passengerDetails,
  //     //     contact_info: "",  
  //     //     seats_booked: 1,   
  //     //     ticket_price: 100, 
  //     //   });

  //     //   Alert.alert("Booking Successful", "Seat has been booked successfully!");
  //     //   setBookSeat(false);



  //     } catch (error) {
  //       Alert.alert("Error", "Could not book the seat, please try again.");
  //     }

  //   } else {
  //     Alert.alert("Error", "Please fill all the fields!");
  //   }
  // };
  const handleBookSeat = async () => {
    try{
      if (!busNumber.trim() || !seatNumber.trim() || !passengerDetails.trim() || !departureTime.trim()) {
        Alert.alert("Error", "Please fill all the fields!");
        return 
      }

           await addDoc(collection(firestore, "Bookings"), {
         
          seat_number: seatNumber,
          passenger_name: passengerDetails,
          contact_info:passengerDetails,
          departure:departureTime,  
          
        });
        busNumber('')
        seatNumber('')
        passengerDetails('')
        departureTime('')
        fetchData()
    }catch(error){
      console.log("error in adding")
    }
  }
  const fetchData=async()=>{
    try{
      const queryList=await getDocs(collection(firestore,"Bookings"))

    const  bookLists=queryList.docs.map((d)=>({
        id:d.id,
        seat_number:d.data().seat_number,
        passenger_name:d.data().passenger_name,
        contact_info:d.data(). contact_info,
        departure:d.data().departure,


      }))
      setBookList(bookLists)
      fetchData()

    }catch(error){
      console.error("error fetching data")
    }
  }

//fetching bus data from firebase
  const fetchBusData=async()=>{
    try{
      const queryList=await getDocs(collection(firestore,"Buses"))

    const  busDetails=queryList.docs.map((d)=>({
        id:d.id,
        bus_id:d.data().bus_id,
        bus_number:d.data().bus_number,
        available_seats:d.data().available_seats,
        arrival_time:d.data().arrival_time,
        departure_time:d.data().departure_time


      }))
      setBusList(busDetails)
    //  fetchBusData()

    }catch(error){
      console.error("error fetching data")
    }
  }
  useEffect(()=>{
    fetchBusData()
    fetchData()
    
  },[])


  // Cancel Seat Functionality
  const handleCancelSeat = async () => {
    if (bookingId) {
      try {
        
        const bookingQuery = query(
          collection(firestore, "Bookings"),
          where("booking_id", "==", bookingId)
        );
        const bookingSnapshot = await getDocs(bookingQuery);

        if (bookingSnapshot.empty) {
          Alert.alert("Error", "No booking found with this ID.");
          return;
        }

        const bookingDoc = bookingSnapshot.docs[0];
        const busId = bookingDoc.data().bus_id;
        const seatNumber = bookingDoc.data().seat_number;

        const busDoc = await getDoc(doc(firestore, "Buses", busId));
        const availableSeats = busDoc.data().available_seats;

        await updateDoc(doc(firestore, "Buses", busId), {
          available_seats: availableSeats + 1,
        });

        await deleteDoc(doc(firestore, "Bookings", bookingDoc.id));

        Alert.alert("Cancellation Successful", "Your booking has been cancelled.");
        setCancelSeat(false);
      } catch (error) {
        Alert.alert("Error", "Could not cancel the booking, please try again.");
      }
    } else {
      Alert.alert("Error", "Please provide the booking ID.");
    }
  };
 

  // Check Seat Availability
  const handleCheckAvailability = async () => {
    if (busNumber) {
      try {
        const busQuery = query(
          collection(firestore, "Buses"),
          where("bus_number", "==", busNumber)
        );
        const busSnapshot = await getDocs(busQuery);

        if (busSnapshot.empty) {
          Alert.alert("Error", "No bus found with this number.");
          return;
        }

        const busDoc = busSnapshot.docs[0];
        const availableSeats = busDoc.data().available_seats;

        Alert.alert("Seat Availability", `Available seats: ${availableSeats}`);
      } catch (error) {
        Alert.alert("Error", "Could not check seat availability, please try again.");
      }
    } else {
      Alert.alert("Error", "Please provide the bus number.");
    }
  };

 
  const handleDepartureDateChange = (text) => {
    setDepartureTime(text);  
  };

  return (
    <View>
      <View>
        <CustomButton onPress={handleBook}>Book a Seat</CustomButton>
        <CustomButton onPress={handleCancel}>Cancel a Seat</CustomButton>
        <CustomButton onPress={handleCheckSeat}>Check Seat Availability</CustomButton>
        <CustomButton onPress={handleExitSystem}>Exit the System</CustomButton>
        
      </View>

      {/* Book a Seat Form */}
      {bookSeat && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Seat Number"
            keyboardType="numeric"
            value={seatNumber}
            onChangeText={setSeatNumber}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Passenger Details"
            value={passengerDetails}
            onChangeText={setPassengerDetails}
          />

          {/* Departure Date Input*/}
          <TextInput
            style={styles.inputs}
            placeholder="Select Departure Date (YYYY-MM-DD)"
            value={departureTime}  // Manually entered date
            onChangeText={handleDepartureDateChange}  
          />

          {/* Book Button */}
          <View style={styles.btnBookContainer}>
            <View style={styles.btnBook}>
              <Button title="Book" onPress={handleBookSeat} />
            </View>
          </View>
        </View>
      )}

      {/* Cancel Seat Form */}
      {cancelSeat && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Booking ID"
            value={bookingId}
            onChangeText={setBookingId}
          />
          <CustomButton style={styles.stylesCan} onPress={handleCancelSeat}>
            Cancel Booking
          </CustomButton>
        </View>
      )}

      {/* Check Seat Availability Form */}
      {checkSeat && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
          />
          <CustomButton style={styles.stylesSearch} onPress={handleCheckAvailability}>
            Check Availability
          </CustomButton>
        </View>
      )}
      {/* booking  data */}
      <FlatList data={bookList}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <View>
          <Text>{item.seat_number}</Text>
          <Text>{item.passenger_name}</Text>
          <Text>{item.contact_info}</Text>
          <Text>{item.departure}</Text>
          </View>
  )}
      />
      {/* bus details */}
      {/* <FlatList data={busList}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <View>
          <Text>{item.bus_id}</Text>
          <Text>{item.bus_number}</Text>
          <Text>{item.available_seats}</Text>
          <Text>{item.arrival_time}</Text>
          <Text>{item.departure_time}</Text>
          </View>
  )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: "pink",
    borderWidth: 3,
  },
  inputs: {
    marginTop: 6,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
    paddingLeft: 10,
  },
  btnBookContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnBook: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
  },
  stylesCan: {
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    borderRadius: 25,
    marginVertical: 5,
  },
  stylesSearch: {
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    borderRadius: 25,
    marginVertical: 5,
  },
});
