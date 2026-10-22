import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { CaptureFab } from "@/src/shared/ui/CaptureFab";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#6526CF", tabBarLabelStyle: { fontWeight: "600" } }}>
        <Tabs.Screen name="index" options={{ title: "Ahora", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sparkles-outline" size={size} /> }} />
        <Tabs.Screen name="inbox" options={{ title: "Bandeja", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="file-tray-outline" size={size} /> }} />
        <Tabs.Screen name="projects" options={{ title: "Proyectos", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="layers-outline" size={size} /> }} />
      </Tabs>
      <CaptureFab />
    </View>
  );
}
