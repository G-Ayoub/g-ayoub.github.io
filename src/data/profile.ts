export const profile = {
  name: 'Ayoub Ghaffour',
  role: 'IT Manager · Mobile App Development',
  title: 'Ayoub Ghaffour — Mobile & Research Engineer',
  description:
    'Ayoub Ghaffour — IT Manager, Mobile App Development and research engineer. 10+ years of mobile, backend, IoT and monitoring systems.',
  lede: 'Mobile developer and research engineer. Ten years of building apps, backends, IoT platforms and the systems that keep datacenters honest.',
  about:
    'Experienced mobile developer with 10+ years building mobile apps, backend systems, IoT platforms, datacenter monitoring solutions, and stress-testing infrastructures.',
  yearsBuilding: '10+',
} as const;

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export const contacts: ContactLink[] = [
  { label: 'Email', value: 'ayth2009@gmail.com', href: 'mailto:ayth2009@gmail.com' },
  { label: 'Phone', value: '+213 660 900 288', href: 'tel:+213660900288' },
  {
    label: 'LinkedIn',
    value: 'in/ayoub-ghaffour',
    href: 'https://www.linkedin.com/in/ayoub-ghaffour/',
    external: true,
  },
];
