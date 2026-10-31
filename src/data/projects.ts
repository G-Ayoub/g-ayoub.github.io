import type { IconName } from '@/lib/icons';

export const categories = ['mobile', 'web', 'iot', 'ai', 'testing'] as const;
export type Category = (typeof categories)[number];
export type Filter = 'all' | Category;

export const categoryLabels: Record<Filter, string> = {
  all: 'All',
  mobile: 'Mobile',
  web: 'Web',
  iot: 'IoT',
  ai: 'AI',
  testing: 'Testing',
};

export interface Project {
  id: string;
  title: string;
  summary: string;
  categories: Category[];
  icon: IconName;
  /** e.g. "2022 – now" */
  years?: string;
  stack?: string[];
  /** A headline result, shown prominently */
  metric?: string;
}

/** Newest and most notable first. */
export const projects: Project[] = [
  { id: 'ai-crm', title: 'AI CRM Agent', summary: 'Natural-language to SQL agent for a Gulf satellite operator, delivered at HikmaNova.', categories: ['ai', 'web'], icon: 'databaseZap', years: '2026', stack: ['LLM agents', 'Text-to-SQL'] },
  { id: 'come2me', title: 'Come2Me', summary: 'Freelance ride-hailing app, published on Google Play.', categories: ['mobile', 'web'], icon: 'car', years: '2025 – now', stack: ['Flutter', 'Django', 'Docker'] },
  { id: 'smartboard', title: 'Smartboard', summary: 'Executive KPI dashboard on mobile and smart TV, used by top management.', categories: ['mobile', 'web'], icon: 'dashboard', years: '2022 – now', stack: ['Flutter', 'Smart TV'], metric: 'Third version' },
  { id: 'marhaba', title: 'Marhaba', summary: 'Mobile app for a national sports ticketing platform — from scoping and estimates to delivery.', categories: ['mobile'], icon: 'ticket', stack: ['Flutter'] },
  { id: 'bassyr', title: 'BASSYR — Datacenter Monitoring', summary: 'In-house monitoring of UPS, PMU, rectifiers, sensors and alarms, giving operations real-time visibility of infrastructure health.', categories: ['web', 'iot'], icon: 'server', stack: ['SNMP', 'Modbus'] },
  { id: 'fifa', title: 'FIFA World Cup Qatar 2022 Field Service', summary: 'Field-service solution for stadium teams using IoT, iBeacon and Bluetooth.', categories: ['mobile', 'iot'], icon: 'trophy', years: '2022', stack: ['IoT', 'iBeacon', 'Bluetooth'], metric: '100+ stadium staff tracked' },
  { id: 'inventory', title: 'Inventory App', summary: 'Barcode scanning with ML Kit and SQLite storage.', categories: ['mobile'], icon: 'barcode', years: '2021', stack: ['ML Kit', 'SQLite'], metric: 'Inventory time cut by 75%+' },
  { id: 'e-payment', title: 'E-Payment App', summary: 'The company e-payment app — Android first, then iOS with Flutter.', categories: ['mobile', 'web'], icon: 'card', years: '2019 – 2020', stack: ['Android', 'Flutter'], metric: '100K+ users' },
  { id: 'media-watch', title: 'Media Watch Automation', summary: 'Automated multimedia content tracking (Veille Médiatique).', categories: ['mobile', 'web'], icon: 'news', years: '2019', stack: ['Android', 'Web'], metric: 'Saves 5+ hrs/week' },
  { id: 'queue', title: 'Point-of-Sale Queue Management', summary: 'Queue optimization for telecom agencies.', categories: ['mobile', 'web'], icon: 'queue', years: '2018', stack: ['Web', 'Mobile'] },
  { id: 'qos-testing', title: 'Algérie Poste QoS Testing', summary: 'Load and stress testing with k6, Grafana and InfluxDB.', categories: ['testing'], icon: 'gauge', stack: ['k6', 'Grafana', 'InfluxDB'] },
  { id: 'chatbot', title: 'ChatBot Mobile App', summary: 'AI-powered customer support bot.', categories: ['mobile', 'ai'], icon: 'bot' },
  { id: 'junction-box', title: 'Smart Telephone Junction Box', summary: 'NFC-powered telecom configuration system — companion app for the patented device.', categories: ['mobile', 'iot'], icon: 'nfc', stack: ['NFC'] },
  { id: 'filtering', title: 'Smart Internet Filtering', summary: 'IoT parental internet filtering system — companion app for the patented device.', categories: ['mobile', 'iot'], icon: 'shieldBan' },
  { id: 'app-store', title: 'Private Android App Store', summary: 'APK hosting, updates and Keycloak authentication.', categories: ['mobile', 'web'], icon: 'store', stack: ['Android', 'Keycloak'] },
  { id: 'sales-leader', title: 'Sales Leader App', summary: 'Performance ranking system for commercial teams.', categories: ['mobile'], icon: 'medal' },
  { id: 'energy', title: 'Energy Monitoring System', summary: 'SNMP-based energy and environment monitoring.', categories: ['web', 'iot'], icon: 'bolt', stack: ['SNMP'] },
];
