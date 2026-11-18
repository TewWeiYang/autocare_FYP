const Svg = ({ d, size = 22, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

export const HomeIcon = (p) => <Svg d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...p} />;
export const WrenchIcon = (p) => <Svg d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.2-.5-.5-2.2z" {...p} />;
export const CarIcon = (p) => <Svg d={['M5 15l1.6-5a2 2 0 0 1 1.9-1.4h7a2 2 0 0 1 1.9 1.4L19 15', 'M3 15h18v4H3zM6 19v2M18 19v2']} {...p} />;
export const UserIcon = (p) => <Svg d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" {...p} />;
export const BellIcon = (p) => <Svg d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" {...p} />;
export const BackIcon = (p) => <Svg d="M19 12H5M11 6l-6 6 6 6" {...p} />;
export const CalendarIcon = (p) => <Svg d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4" {...p} />;
export const ClockIcon = (p) => <Svg d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" {...p} />;
export const BookIcon = (p) => <Svg d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6" {...p} />;
export const SupportIcon = (p) => <Svg d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19a4 4 0 0 1-4 3h-3" {...p} />;
export const TyreIcon = (p) => <Svg d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" {...p} />;
export const DotsIcon = (p) => <Svg d="M5 12h.01M12 12h.01M19 12h.01" {...p} />;
export const CheckIcon = (p) => <Svg d="M5 12l5 5 9-10" {...p} />;

export const ICONS = { wrench: WrenchIcon, car: CarIcon, tyre: TyreIcon, dots: DotsIcon };
