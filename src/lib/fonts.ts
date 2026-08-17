import localFont from "next/font/local";

export const generalSans = localFont({
  src: "../fonts/GeneralSans-Variable.woff2",
  weight: "200 700",
  display: "swap",
  variable: "--font-display",
});

export const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/JetBrainsMono-Regular.woff2", weight: "400" },
    { path: "../fonts/JetBrainsMono-Medium.woff2", weight: "500" },
  ],
  display: "swap",
  variable: "--font-mono",
});
