import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="home-screen" options={{ title: "בית" }} />
      <Stack.Screen name="login" options={{ title: "התחברות" }} />
      <Stack.Screen name="register" options={{ title: "הרשמה" }} />
    </Stack>
  );
}
