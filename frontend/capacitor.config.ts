import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.habitos',
  appName: 'Habitos',
  webDir: 'dist/habitos/browser',
  server: {
    allowNavigation: ['habitos-api.example.com']
  }
};

export default config;
