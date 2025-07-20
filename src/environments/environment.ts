export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  version: '1.0.0',
  appName: 'EcoRide',
  features: {
    enableNotifications: true,
    enableGeolocation: true,
    enableOfflineMode: false,
    enableAnalytics: false
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  auth: {
    tokenKey: 'ecoride_token',
    refreshTokenKey: 'ecoride_refresh_token',
    rememberMeKey: 'ecoride_remember_me'
  },
  payment: {
    stripePublicKey: '',
    paypalClientId: ''
  },
  maps: {
    googleMapsApiKey: '',
    mapboxAccessToken: ''
  },
  social: {
    facebookAppId: '',
    googleClientId: ''
  }
};
