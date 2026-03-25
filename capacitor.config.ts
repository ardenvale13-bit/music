import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ardenvale.music",
  appName: "Arden Vale Music",
  webDir: "out",
  server: {
    // For development, point to your dev server
    // url: "http://YOUR_LOCAL_IP:3000",
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0c0a0e",
    },
  },
};

export default config;
