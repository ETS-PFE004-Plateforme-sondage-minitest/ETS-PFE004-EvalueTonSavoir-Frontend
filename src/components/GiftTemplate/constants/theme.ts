import { colors } from "./colors";

type Color = keyof typeof colors;

export const theme = (theme: "light" | "dark", light: Color, dark: Color) => {
  if (theme === "light") {
    return colors[light];
  } else {
    return colors[dark];
  }
};
