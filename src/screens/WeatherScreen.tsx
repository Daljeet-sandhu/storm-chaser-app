
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Storm Chaser App - Weather Screen</Text>
    </View>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001d3d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});
