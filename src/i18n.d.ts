import 'react-i18next';
import { resources } from './i18n'; // adjust the import path as needed

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}
