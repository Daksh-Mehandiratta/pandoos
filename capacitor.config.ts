import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandoos.music',
  appName: 'Pandoos',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Allows audio to play in background on iOS
    allowNavigation: [
      "*.youtube.com",
      "*.ytimg.com",
      "*.supabase.co"
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0f",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
