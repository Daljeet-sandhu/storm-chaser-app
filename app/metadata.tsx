import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MetadataScreen() {
  const { photoUri } = useLocalSearchParams();
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dateTime, setDateTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleString();
  });
  const [description, setDescription] = useState('');
  const [stormType, setStormType] = useState('');

  const saveMetadata = async () => {
    const metadata = {
      photoUri,
      weather,
      location,
      dateTime,
      description,
      stormType,
    };
    try {
      const existing = await AsyncStorage.getItem('storm_metadata');
      const arr = existing ? JSON.parse(existing) : [];
      arr.push(metadata);
      await AsyncStorage.setItem('storm_metadata', JSON.stringify(arr));
      Alert.alert('Success', 'Metadata saved locally!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save metadata.');
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  console.log('Alınan photoUri:', photoUri);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>📝 Storm Metadata</Text>
        <Text style={styles.uri}>{photoUri ? String(photoUri) : 'No URI'}</Text>
        <Image
          source={photoUri ? { uri: String(photoUri) } : undefined}
          style={styles.image}
          onError={e => {
            console.log('Image yüklenemedi:', e.nativeEvent.error);
          }}
        />

        {/* Weather Condition alanı */}
        <Text style={styles.label}>Weather Condition</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setWeather('Sunny')}>
            <Text style={[styles.pickerOption, weather === 'Sunny' && styles.selected]}>Sunny</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWeather('Rainy')}>
            <Text style={[styles.pickerOption, weather === 'Rainy' && styles.selected]}>Rainy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWeather('Stormy')}>
            <Text style={[styles.pickerOption, weather === 'Stormy' && styles.selected]}>Stormy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setWeather('Snowy')}>
            <Text style={[styles.pickerOption, weather === 'Snowy' && styles.selected]}>Snowy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.selectedValue}>Selected: {weather}</Text>

        {/* Location alanı */}
        <Text style={styles.label}>Location</Text>
        <Text style={styles.location}>
          {location
            ? `Latitude: ${location.latitude}\nLongitude: ${location.longitude}`
            : 'Getting location...'}
        </Text>

        {/* Date & Time alanı */}
        <Text style={styles.label}>Date & Time</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>

        {/* Description / Notes alanı */}
        <Text style={styles.label}>Description / Notes</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter a description or notes..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Storm Type / Classification alanı */}
        <Text style={styles.label}>Storm Type / Classification</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={() => setStormType('Supercell')}>
            <Text style={[styles.pickerOption, stormType === 'Supercell' && styles.selected]}>Supercell</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStormType('Squall Line')}>
            <Text style={[styles.pickerOption, stormType === 'Squall Line' && styles.selected]}>Squall Line</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStormType('Tornado')}>
            <Text style={[styles.pickerOption, stormType === 'Tornado' && styles.selected]}>Tornado</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStormType('Other')}>
            <Text style={[styles.pickerOption, stormType === 'Other' && styles.selected]}>Other</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.selectedValue}>Selected: {stormType}</Text>

        <Button title="Save" onPress={saveMetadata} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  uri: { fontSize: 12, color: '#888', marginBottom: 8 },
  image: { width: 200, height: 200, backgroundColor: '#000', borderRadius: 12 },
  label: { fontWeight: 'bold', marginTop: 24, marginBottom: 8, fontSize: 16 },
  pickerContainer: { flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' },
  pickerOption: {
    padding: 8,
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: '#eee',
    borderRadius: 6,
    color: '#333',
  },
  dateTime: { color: '#333', marginBottom: 8, textAlign: 'center' },
  selected: {
    backgroundColor: '#0077b6',
    color: '#fff',
  },
  textInput: {
    width: '80%',
    minHeight: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  selectedValue: { marginBottom: 8, color: '#444' },
  location: { color: '#333', marginBottom: 8, textAlign: 'center' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});