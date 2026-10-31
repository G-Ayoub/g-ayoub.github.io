export const profile = {
  name: 'Ayoub Ghaffour',
  role: 'IT Manager · Mobile App Development',
  focus: 'Mobile & Backend Engineering · Telecom · IoT & AI',
  title: 'Ayoub Ghaffour — IT Manager, Mobile App Development',
  description:
    'Ayoub Ghaffour — IT Manager for mobile app development at Algérie Télécom. 9+ years building Android, iOS and Flutter apps with Django back ends; co-inventor on four patents.',
  lede: 'I lead mobile app development at Algérie Télécom — Android, iOS and Flutter apps with production Django back ends, from R&D to launch.',
  about:
    'IT Manager for mobile application development at Algérie Télécom, with 12+ years in the company and 9+ years building and delivering Android, iOS and Flutter applications and production Django back ends on Docker. I lead the mobile development team and report progress to executive management — bringing together network engineering, R&D and hands-on development.',
  availability: 'Open to mobile engineering or IT management roles leading digital products at scale.',
  location: 'Nédroma, Tlemcen, Algeria',
  stats: [
    { value: '9+', label: 'Years shipping apps' },
    { value: '12+', label: 'Years at Algérie Télécom' },
    { value: '100K+', label: 'E-payment app users' },
  ],
} as const;

export interface ContactLink {
  label: string;
  value: string;
  /** Rows without a link are shown as plain information. */
  href?: string;
  external?: boolean;
}

export const contacts: ContactLink[] = [
  { label: 'Email', value: 'ayth2009@gmail.com', href: 'mailto:ayth2009@gmail.com' },
  { label: 'Phone', value: '+213 (0) 660 90 02 88', href: 'tel:+213660900288' },
  {
    label: 'LinkedIn',
    value: 'in/ayoub-ghaffour',
    href: 'https://www.linkedin.com/in/ayoub-ghaffour/',
    external: true,
  },
  { label: 'Location', value: 'Nédroma, Tlemcen, Algeria' },
];
