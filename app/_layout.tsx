import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Weather Info" }} />
      <Stack.Screen name="capture" options={{ title: "Capture Storm" }} />
      <Stack.Screen name="metadata" options={{ title: "Storm Details" }} />
    </Stack>
  );
}
