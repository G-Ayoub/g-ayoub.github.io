import {
  Activity, Bot, BrainCircuit, Car, Container, CreditCard, Database, DatabaseZap, Gauge,
  LayoutDashboard, ListOrdered, LockKeyhole, Medal, Network, Newspaper, Nfc, RadioTower,
  ScanBarcode, Server, ShieldBan, Smartphone, Store, Ticket, Trophy, Zap,
  type LucideIcon,
} from 'lucide-react';

/** Icons are referenced by name in data so island props stay serializable. */
export const icons = {
  activity: Activity,
  ai: BrainCircuit,
  bot: Bot,
  car: Car,
  container: Container,
  card: CreditCard,
  database: Database,
  databaseZap: DatabaseZap,
  gauge: Gauge,
  dashboard: LayoutDashboard,
  queue: ListOrdered,
  lock: LockKeyhole,
  medal: Medal,
  network: Network,
  news: Newspaper,
  nfc: Nfc,
  radio: RadioTower,
  barcode: ScanBarcode,
  server: Server,
  shieldBan: ShieldBan,
  phone: Smartphone,
  store: Store,
  ticket: Ticket,
  trophy: Trophy,
  bolt: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;
