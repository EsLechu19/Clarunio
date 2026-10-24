import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

import { CaptureFab } from "@/src/shared/ui/CaptureFab";

export default function TabsLayout() {
  const colors = useAppTheme();
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textSecondary, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.outline }, tabBarLabelStyle: { fontWeight: "600" } }}>
        <Tabs.Screen name="index" options={{ title: "Ahora", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="sparkles-outline" size={size} /> }} />
        <Tabs.Screen name="inbox" options={{ title: "Bandeja", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="file-tray-outline" size={size} /> }} />
        <Tabs.Screen name="projects" options={{ title: "Proyectos", tabBarIcon: ({ color, size }) => <Ionicons color={color} name="layers-outline" size={size} /> }} />
      </Tabs>
      <CaptureFab />
    </View>
  );
}
