


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function EntriesScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await AsyncStorage.getItem('storm_metadata');
      if (data) {
        setEntries(JSON.parse(data));
      }
    };
    fetchEntries();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>📋 Saved Storm Entries</Text>
        {entries.length === 0 ? (
          <Text style={styles.empty}>No entries found.</Text>
        ) : (
          entries.map((item, idx) => (
            <View key={idx} style={styles.card}>
              {item.photoUri && (
                <Image source={{ uri: item.photoUri }} style={styles.image} />
              )}
              <Text style={styles.text}>Weather: {item.weather}</Text>
              <Text style={styles.text}>Location: {item.location?.latitude}, {item.location?.longitude}</Text>
              <Text style={styles.text}>Date & Time: {item.dateTime}</Text>
              <Text style={styles.text}>Description: {item.description}</Text>
              <Text style={styles.text}>Storm Type: {item.stormType}</Text>
            </View>
          ))
        )}
        <Button title="Back to Home" onPress={() => router.push('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 32,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  empty: { color: '#888', marginTop: 32 },
  card: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  image: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8 },
  text: { color: '#333', marginBottom: 4 },
});