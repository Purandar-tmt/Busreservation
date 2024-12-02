

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const CustomButton = ({ children, onPress, style }) => {
  return (
    <View>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={[styles.btnContainer, style]}
          onPress={onPress}
        >
          <Text style={[styles.btnText, style]}>{children}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // flex:1,
  },
  btnText: {
    marginTop: 10,
    color: "red",
  },
  btnContainer: {
    backgroundColor: "blue",
    marginTop: 5,
    marginHorizontal: 30,
    padding: 10,
  },
  stylesCan: {
    backgroundColor: "red",
  },
});
