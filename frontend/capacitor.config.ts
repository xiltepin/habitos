import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.xiltepin.habitos',
  appName: 'Habitos',
  webDir: 'dist/habitnow/browser',
  server: {
    allowNavigation: ['habitos-api.xiltepin.me']
  }
};

export default config;
