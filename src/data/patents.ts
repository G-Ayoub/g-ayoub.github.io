export interface Patent {
  title: string;
  number: string;
  status: 'issued' | 'filed';
  /** ISO date of the status above (issue date or filing date) */
  date: string;
  office: string;
}

export const patents: Patent[] = [
  { title: 'Smart Internet Filtering Device for Kids Safety', number: 'PCT/ID/DZ/P/2018/00051', status: 'issued', date: '2018-01-23', office: 'INAPI DZ' },
  { title: 'Smart Telephone Junction Box', number: 'PCT/ID/DZ/P/2018/00038', status: 'issued', date: '2018-01-16', office: 'INAPI DZ' },
  { title: 'Novel Radio Transmission Detection System', number: 'DZ/P/2017/00562', status: 'filed', date: '2017-10-08', office: 'INAPI DZ' },
  { title: 'Wireless Client Satisfaction Board', number: 'DZ/P/2017/00561', status: 'filed', date: '2017-10-08', office: 'INAPI DZ' },
];
