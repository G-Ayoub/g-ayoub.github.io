export interface Patent {
  title: string;
  number: string;
  /** ISO date the application was filed */
  filed: string;
  office: string;
  status: string;
}

// NOTE: two entries share DZ/P/2017/00561 in the source CV — confirm the correct number.
export const patents: Patent[] = [
  { title: 'Smart Internet Filtering Device for Kids Safety', number: 'PCT/ID/DZ/P/2018/00051', filed: '2018-01-23', office: 'INAPI DZ', status: 'Submitted / Accepted' },
  { title: 'Smart Telephone Junction Box', number: 'DZ/P/2017/00561', filed: '2017-10-08', office: 'INAPI DZ', status: 'Submitted / Accepted' },
  { title: 'Novel Radio Transmission Detection System', number: 'DZ/P/2017/00562', filed: '2017-10-08', office: 'INAPI DZ', status: 'Submitted / Accepted' },
  { title: 'Wireless Client Satisfaction Board', number: 'DZ/P/2017/00561', filed: '2017-10-08', office: 'INAPI DZ', status: 'Submitted / Accepted' },
];
