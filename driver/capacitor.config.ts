import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:   'com.quickmart.driver',
  appName: 'QuickMart — المندوب',
  webDir:  'dist',
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration:   2000,
      backgroundColor:      '#0F0800',
      androidSplashResourceName: 'splash',
      showSpinner:          false,
    },
    StatusBar: {
      style:           'DARK',
      backgroundColor: '#0F0800',
    },
    Geolocation: {
      permissions: ['coarseLocation', 'fineLocation'],
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor:   '#0F0800',
  },
}

export default config
