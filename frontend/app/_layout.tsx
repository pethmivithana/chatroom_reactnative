// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        {/* Index screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Chat screen */}
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
