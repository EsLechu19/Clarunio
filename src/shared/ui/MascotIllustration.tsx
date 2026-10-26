import { Image, StyleSheet, type ImageStyle, type StyleProp } from "react-native";

import { useResponsive } from "./useResponsive";

export const MASCOT_VARIANTS = [
  "default",
  "waving",
  "weeklyReview",
  "recovery",
  "thinking",
  "empty",
  "error",
  "capture",
  "celebrating"
] as const;

export type MascotVariant = (typeof MASCOT_VARIANTS)[number];
export type MascotSize = "compact" | "standard";

const MASCOT_ASSETS: Record<MascotVariant, number> = {
  default: require("../../../img/mascota.png"),
  waving: require("../../../img/mascota_saludando.png"),
  weeklyReview: require("../../../img/mascota_revision_semanal.png"),
  recovery: require("../../../img/mascota_recuperacion.png"),
  thinking: require("../../../img/mascota_pensando.png"),
  empty: require("../../../img/mascota_estado_vacio.png"),
  error: require("../../../img/mascota_estado_error.png"),
  capture: require("../../../img/mascota_acompaña_captura.png"),
  celebrating: require("../../../img/mascota celebrando_accion_completada.png")
};

type MascotIllustrationProps = {
  variant?: MascotVariant;
  size?: MascotSize;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
};

export function MascotIllustration({ variant = "default", size = "standard", accessibilityLabel, style }: MascotIllustrationProps) {
  const responsive = useResponsive();
  const dimension = size === "compact" ? (responsive.isCompact ? 132 : 160) : (responsive.isCompact ? 176 : 220);

  return (
    <Image
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      resizeMode="contain"
      source={MASCOT_ASSETS[variant]}
      style={[styles.image, { height: dimension, width: dimension }, style]}
    />
  );
}

const styles = StyleSheet.create({ image: { alignSelf: "center" } });
