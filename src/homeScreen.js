
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const Home = () => {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Go to Book a Seat" onPress={() => navigate.navigate("booking")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

