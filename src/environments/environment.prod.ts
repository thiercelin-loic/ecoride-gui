export const environment = {
  production: true,
  apiUrl: 'https://api.ecoride.fr/api',
  wsUrl: 'wss://api.ecoride.fr',
  version: '1.0.0',
  appName: 'EcoRide',
  features: {
    enableNotifications: true,
    enableGeolocation: true,
    enableOfflineMode: true,
    enableAnalytics: true
  },
  cache: {
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 200
  },
  auth: {
    tokenKey: 'ecoride_token',
    refreshTokenKey: 'ecoride_refresh_token',
    rememberMeKey: 'ecoride_remember_me'
  },
  payment: {
    stripePublicKey: '', // Set during build
    paypalClientId: ''   // Set during build
  },
  maps: {
    googleMapsApiKey: '',    // Set during build
    mapboxAccessToken: ''    // Set during build
  },
  social: {
    facebookAppId: '',       // Set during build
    googleClientId: ''       // Set during build
  }
};
