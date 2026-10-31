import type { IconName } from '@/lib/icons';

export const categories = ['mobile', 'web', 'iot', 'testing'] as const;
export type Category = (typeof categories)[number];
export type Filter = 'all' | Category;

export const categoryLabels: Record<Filter, string> = {
  all: 'All',
  mobile: 'Mobile',
  web: 'Web',
  iot: 'IoT',
  testing: 'Testing',
};

export interface Project {
  id: string;
  title: string;
  summary: string;
  categories: Category[];
  icon: IconName;
}

export const projects: Project[] = [
  { id: 'smartboard', title: 'Smartboard', summary: 'Telecom KPI dashboard for executives — smart TV dashboard and mobile app.', categories: ['mobile', 'web'], icon: 'dashboard' },
  { id: 'fifa', title: 'Field Management — FIFA 2022', summary: 'IoT, Bluetooth and iBeacon automation for stadium teams.', categories: ['mobile', 'iot'], icon: 'trophy' },
  { id: 'inventory', title: 'Inventory App', summary: 'Barcode scanning with ML Kit and SQLite storage.', categories: ['mobile'], icon: 'barcode' },
  { id: 'sales-leader', title: 'Sales Leader App', summary: 'Performance ranking system for commercial teams.', categories: ['mobile'], icon: 'medal' },
  { id: 'chatbot', title: 'ChatBot Mobile App', summary: 'AI-powered customer support bot.', categories: ['mobile'], icon: 'bot' },
  { id: 'junction-box', title: 'Smart Telephone Junction Box', summary: 'NFC-powered telecom configuration system.', categories: ['mobile', 'iot'], icon: 'nfc' },
  { id: 'e-payment', title: 'E-Payment App', summary: 'Android and iOS digital payment platform.', categories: ['mobile', 'web'], icon: 'card' },
  { id: 'filtering', title: 'Smart Internet Filtering', summary: 'IoT parental internet filtering system.', categories: ['mobile', 'iot'], icon: 'shieldBan' },
  { id: 'media-watch', title: 'Veille Médiatique', summary: 'Automated multimedia content tracking.', categories: ['mobile'], icon: 'news' },
  { id: 'queue', title: 'Queue Management System', summary: 'Queue optimization for telecom agencies.', categories: ['mobile', 'web'], icon: 'ticket' },
  { id: 'app-store', title: 'Private Android App Store', summary: 'APK hosting, updates and Keycloak authentication.', categories: ['mobile', 'web'], icon: 'store' },
  { id: 'energy', title: 'Energy Monitoring System', summary: 'SNMP-based energy and environment monitoring.', categories: ['web', 'iot'], icon: 'bolt' },
  { id: 'datacenter', title: 'Datacenter Monitoring System', summary: 'UPS, PMU, rectifiers, sensors and alarms.', categories: ['web', 'iot'], icon: 'server' },
  { id: 'qos-testing', title: 'Algérie Poste QoS Testing', summary: 'Load and stress testing with k6, Grafana and InfluxDB.', categories: ['testing'], icon: 'gauge' },
];
