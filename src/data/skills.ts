import type { IconName } from '@/lib/icons';

export interface Skill {
  title: string;
  items: string;
  icon: IconName;
}

export const skills: Skill[] = [
  { title: 'Mobile', items: 'Flutter / Dart, Android (Kotlin, Java), iOS via Flutter', icon: 'phone' },
  { title: 'Backend', items: 'Python, Django, REST APIs, PostgreSQL, MySQL, SQLite', icon: 'database' },
  { title: 'AI', items: 'LLM agents, text-to-SQL, chatbots, prompt engineering', icon: 'ai' },
  { title: 'IoT', items: 'Bluetooth (SPP, HID, BLE), iBeacon, NFC, SNMP, Modbus', icon: 'radio' },
  { title: 'DevOps', items: 'Docker, Kubernetes (basic), CI/CD, Harbor registry', icon: 'container' },
  { title: 'Monitoring & QA', items: 'Grafana, Prometheus, InfluxDB, k6 load testing', icon: 'activity' },
  { title: 'Cloud & Security', items: 'Firebase, Keycloak / JWT auth, secure coding', icon: 'lock' },
  { title: 'Networking', items: 'Routing & switching, MSAN, DSLAM, BRAS', icon: 'network' },
];

export const strengths: string[] = [
  'Team management & coaching',
  'Full-stack delivery (mobile + backend)',
  'Annual planning & project portfolio',
  'Agile delivery (Scrum)',
  'Executive reporting',
  'IT service management (ITIL)',
];
