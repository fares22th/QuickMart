import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:   'com.quickmart.customer',
  appName: 'QuickMart',
  webDir:  'dist',
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration:   2500,
      backgroundColor:      '#00C896',
      androidSplashResourceName: 'splash',
      showSpinner:          false,
    },
    StatusBar: {
      style:           'DARK',
      backgroundColor: '#ffffff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor:   '#ffffff',
  },
}

export default config
