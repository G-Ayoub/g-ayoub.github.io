export interface Role {
  title: string;
  company: string;
  unit: string;
  /** Display period, e.g. "07/2017 – Present" */
  period: string;
  /** ISO start (YYYY-MM) for <time> */
  start: string;
  note?: string;
  highlights: string[];
}

export const experience: Role[] = [
  {
    title: 'IT Manager, Mobile App Development',
    company: 'Algérie Télécom',
    unit: 'IT Development & Innovation (R&D Unit), Algiers',
    period: '07/2017 – Present',
    start: '2017-07',
    note: 'Algeria’s national telecom operator · Promoted from Research Engineer / Mobile Developer',
    highlights: [
      'Manage a team of 3–5 mobile developers (expert and junior): task planning, technical guidance, code review and skills development.',
      'Own the full app lifecycle, from research and planning to deployment and post-launch support, for 5+ internal and customer apps.',
      'Lead Smartboard, the executive KPI dashboard on mobile and smart TV used by top management, now in its third version.',
      'Lead BASSYR, the company’s in-house datacenter monitoring solution, collecting equipment data over SNMP and Modbus to give operations teams real-time visibility of infrastructure health and alerts.',
      'Lead the mobile app of Marhaba, a national sports ticketing platform, built in Flutter within the project team, from scoping and estimates to delivery.',
      'Delivered the company e-payment app on Android, then on iOS with Flutter, reaching 100K+ users.',
      'Built a barcode-scanning inventory app (ML Kit) that cut inventory time by more than 75%, plus NFC and IoT-device companion apps for the patented products.',
      'Ran load and QoS testing with k6, Grafana and InfluxDB; test every release before final review.',
      'Restructured the mobile developer job descriptions as part of the company’s HR reorganization.',
      'Run delivery with Agile practices and report weekly progress and milestones to executive management.',
    ],
  },
  {
    title: 'Chief Operating Officer (concurrent role)',
    company: 'HikmaNova',
    unit: 'AI & IoT solutions, North Africa & Gulf',
    period: '2026 – Present',
    start: '2026',
    highlights: [
      'Run operations and project delivery for AI and IoT solutions for enterprise clients in North Africa and the Gulf.',
      'Led delivery of an AI CRM agent (natural-language to SQL) for a Gulf satellite operator.',
      'Before becoming COO, led HikmaNova’s FIFA World Cup Qatar 2022 field-service solution, tracking 100+ stadium staff (IoT, iBeacon, Bluetooth).',
    ],
  },
  {
    title: 'Network Engineer',
    company: 'Algérie Télécom',
    unit: 'Tlemcen',
    period: '06/2014 – 07/2017',
    start: '2014-06',
    highlights: [
      'Analyzed, troubleshot and optimized network performance across access and core equipment.',
      'Configured and maintained routing and switching on MSAN, DSLAM and BRAS platforms.',
    ],
  },
];
