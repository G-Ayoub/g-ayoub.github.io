import type { IconName } from '@/lib/icons';

export interface Skill {
  title: string;
  items: string;
  icon: IconName;
}

export const skills: Skill[] = [
  { title: 'Mobile', items: 'Android (Java/Kotlin), Flutter, Dart', icon: 'phone' },
  { title: 'Backend', items: 'Django, REST APIs, PostgreSQL, SQLite', icon: 'database' },
  { title: 'IoT & Hardware', items: 'Bluetooth SPP, HID, NFC, iBeacon, SNMP', icon: 'radio' },
  { title: 'DevOps', items: 'Docker, Kubernetes (basic), CI/CD pipelines', icon: 'container' },
  { title: 'Security', items: 'Secure coding practices, JWT/Keycloak authentication', icon: 'shield' },
  { title: 'Cloud & Tools', items: 'Firebase, Grafana, Prometheus, k6, InfluxDB', icon: 'chart' },
];
