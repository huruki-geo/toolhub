import { LucideIcon } from 'lucide-react';

export type Language = 'JP' | 'EN';

export enum ToolId {
  SCHEDULE_FORMATTER = 'schedule-formatter',
  ROMAJI_CONVERTER = 'romaji-converter',
  CHART_MAKER = 'chart-maker',
  CALORIE_CHECKER = 'calorie-checker',
  TAX_THRESHOLD = 'tax-threshold-checker',
  PIXEL_EDITOR = 'pixel-editor',
  BROWSER_NOTEPAD = 'browser-notepad',
  FOCUS_TIMER = 'focus-timer',
  LOG_TIMER = 'log-timer',
  MULTI_TIMER = 'multi-timer',
  SIMPLE_TIMER = 'simple-timer',
  PALETTE_GEN = 'palettegen',
  HABIT_PAL = 'habitpal',
  SVG_EDITOR = 'svg-editor',
  CALENDAR_EDITOR = 'calendar-editor',
  CRYPTO_TOOL = 'crypto-tool',
  ENCODING_CONVERTER = 'encoding-converter',
  ABOUT = 'about'
}

export type ViewState = 'HOME' | ToolId;

export interface ToolMeta {
  id: ToolId;
  name: string;      // English Name
  nameJp: string;    // Japanese Name
  path: string;      // URL path (kept for reference or future SSR)
  description: {
    en: string;      // Formal tone
    jp: string;      // Friendly tone
  };
  icon: LucideIcon;
  isImplemented: boolean;
  category: 'Productivity' | 'Design' | 'Health' | 'Utility';
}