// src/types.ts
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
  GANTT_CHART = 'gantt-chart',
  QUOTE_FORMATTER = 'quote-formatter',
  MINUTES_FORMATTER = 'minutes-formatter',
  INVOICE_GENERATOR = 'invoice-generator',
  TIER_MAKER = 'tier-maker',
  VOXEL_EDITOR = 'voxel-editor',
  ALETHEIA = 'aletheia',
  ABOUT = 'about'
}

export type ViewState = 'HOME' | ToolId;

export interface ToolMeta {
  id: ToolId;
  name: string;
  nameJp: string;
  path: string;
  description: {
    en: string;
    jp: string;
  };
  icon: LucideIcon;
  isImplemented: boolean;
  category: 'Productivity' | 'Design' | 'Health' | 'Utility';
  isExternal?: boolean;
}