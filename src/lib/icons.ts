import {
  Bot, ChartLine, Container, CreditCard, Database, Gauge, LayoutDashboard, Medal,
  Newspaper, Nfc, RadioTower, ScanBarcode, Server, ShieldBan, ShieldCheck, Smartphone,
  Store, Ticket, Trophy, Zap,
  type LucideIcon,
} from 'lucide-react';

/** Icons are referenced by name in data so island props stay serializable. */
export const icons = {
  bot: Bot,
  chart: ChartLine,
  container: Container,
  card: CreditCard,
  database: Database,
  gauge: Gauge,
  dashboard: LayoutDashboard,
  medal: Medal,
  news: Newspaper,
  nfc: Nfc,
  radio: RadioTower,
  barcode: ScanBarcode,
  server: Server,
  shieldBan: ShieldBan,
  shield: ShieldCheck,
  phone: Smartphone,
  store: Store,
  ticket: Ticket,
  trophy: Trophy,
  bolt: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;
