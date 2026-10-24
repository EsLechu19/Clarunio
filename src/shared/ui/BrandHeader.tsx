import { Image, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function BrandHeader() {
  const colors = useAppTheme();
  const [assetFailed, setAssetFailed] = useState(false);

  return (
    <View style={styles.container} accessibilityRole="header">
      {!assetFailed ? <><Image accessibilityLabel="Logo de Clarunio" onError={() => setAssetFailed(true)} source={require("../../../img/Imagen de ChatGPT 24 oct 2026, 17_46_18-1.png")} style={styles.logo} resizeMode="contain" /><Text style={[styles.name, { color: colors.text }]}>Clarunio</Text></> : <>
        <View style={[styles.mark, { backgroundColor: colors.primary }]}><Text style={styles.markText}>C</Text></View>
        <Text style={[styles.name, { color: colors.text }]}>Clarunio</Text>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  logo: { borderRadius: 10, height: 34, width: 34 },
  mark: { alignItems: "center", borderRadius: 10, height: 36, justifyContent: "center", width: 36 },
  markText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  name: { fontSize: 18, fontWeight: "700" }
});
