console.log("✅ WeatherScreen loaded");

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function WeatherScreen() {
  const router = useRouter();

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    console.log("🚀 App başladı"); 
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Location permission was not granted.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });
        console.log("Latitude:", latitude, "Longitude:", longitude);

        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation`
        );

        setWeather(response.data.current);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Weather data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🌡️ Temperature: {weather.temperature_2m}°C</Text>
      <Text style={styles.text}>💨 Wind Speed: {weather.wind_speed_10m} km/h</Text>
      <Text style={styles.text}>🌧️ Precipitation: {weather.precipitation} mm</Text>
      {coords && (
        <Text style={styles.text}>📍 Location: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</Text>
      )}
      <TouchableOpacity onPress={() => router.push('/capture')} style={styles.button}>
        <Text style={styles.buttonText}>📷 Go to Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/entries')} style={styles.button}>
      <Text style={styles.buttonText}>📋 View Saved Entries</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001d3d',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#001d3d',
  },
});
