
jest.mock('@react-native-async-storage/async-storage');
import AsyncStorage from '@react-native-async-storage/async-storage';

it('should save metadata to AsyncStorage', async () => {
  const metadata = {
    photoUri: 'test-uri',
    weather: 'Sunny',
    location: { latitude: 1, longitude: 2 },
    dateTime: '2025-06-15 10:00',
    description: 'Test desc',
    stormType: 'Supercell',
  };

  // Simulate saving
  const existing = await AsyncStorage.getItem('storm_metadata');
  const arr = existing ? JSON.parse(existing) : [];
  arr.push(metadata);
  await AsyncStorage.setItem('storm_metadata', JSON.stringify(arr));

  // Read back and check
  const saved = await AsyncStorage.getItem('storm_metadata');
  expect(saved).toContain('Supercell');
});