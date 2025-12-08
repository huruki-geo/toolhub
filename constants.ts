import { 
  CalendarClock, 
  Type, 
  BarChart3, 
  Activity, 
  Wallet, 
  Grid, 
  FileEdit, 
  Palette, 
  CheckSquare,
  Hourglass,
  ScrollText,
  Layers,
  Watch
} from 'lucide-react';
import { ToolMeta, ToolId } from './types';

export const TOOLS: ToolMeta[] = [
  {
    id: ToolId.SIMPLE_TIMER,
    name: 'Simple Timer',
    nameJp: 'シンプルタイマー',
    path: '/tools/simple-timer',
    description: {
      en: 'Standard countdown timer and stopwatch with lap function.',
      jp: '普通のタイマーとストップウォッチです。カップ麺やスポーツに。'
    },
    icon: Watch,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.FOCUS_TIMER,
    name: 'Focus Timer',
    nameJp: '集中・サイクルタイマー',
    path: '/tools/focus-timer',
    description: {
      en: 'Template-based timer with local audio support (Pomodoro, 52/17, HIIT).',
      jp: 'ポモドーロやHIITなど、作業と休憩を繰り返すための高機能タイマーです。区間ごとに音楽を設定できます。'
    },
    icon: Hourglass,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.LOG_TIMER,
    name: 'Log Timer',
    nameJp: '作業ログタイマー',
    path: '/tools/log-timer',
    description: {
      en: 'Track your tasks and create a timeline log with checkpoints.',
      jp: '時間を計測しながら、「作業」「休憩」などのログを記録できます。'
    },
    icon: ScrollText,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.MULTI_TIMER,
    name: 'Multi Timer',
    nameJp: 'マルチタイマー',
    path: '/tools/multi-timer',
    description: {
      en: 'Run multiple timers simultaneously with custom local sounds.',
      jp: '複数のタイマーを同時に動かせます。料理や並行作業に最適です。'
    },
    icon: Layers,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.HABIT_PAL,
    name: 'Habit Pal',
    nameJp: '習慣トラッカー',
    path: '/tools/habitpal',
    description: {
      en: 'Binary habit tracking system using local persistence.',
      jp: '毎日の習慣をポチッと記録。シンプルだから続けられます。'
    },
    icon: CheckSquare,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.BROWSER_NOTEPAD,
    name: 'Browser Notepad',
    nameJp: 'ブラウザメモ帳',
    path: '/tools/browser-notepad',
    description: {
      en: 'Persistent text editor with auto-save and stats.',
      jp: '自動保存はもちろん、文字数カウントやコピー機能もついた高機能メモ帳です。'
    },
    icon: FileEdit,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.PIXEL_EDITOR,
    name: 'Pixel Editor',
    nameJp: 'ドット絵エディタ',
    path: '/tools/pixel-editor',
    description: {
      en: 'Lightweight raster graphics editor optimized for pixel art.',
      jp: 'スマホでもサクサク描ける、シンプルなドット絵作成ツールです。'
    },
    icon: Grid,
    isImplemented: true,
    category: 'Design'
  },
  {
    id: ToolId.TAX_THRESHOLD,
    name: 'Tax Threshold',
    nameJp: '扶養壁チェッカー',
    path: '/tools/tax-threshold-checker',
    description: {
      en: 'Income threshold analysis for tax dependency status.',
      jp: '年収103万・130万の壁を超えていないか、簡単にチェックできます。'
    },
    icon: Wallet,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.SCHEDULE_FORMATTER,
    name: 'Schedule Formatter',
    nameJp: 'スケジュール自動整形',
    path: '/tools/schedule-formatter',
    description: {
      en: 'Automated chronological sorting and standardizing of unstructured temporal text data.',
      jp: 'キーボードで適当に打ったスケジュールを、時間順に並べ替えてきれいに整形します。'
    },
    icon: CalendarClock,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.ROMAJI_CONVERTER,
    name: 'Romaji Converter',
    nameJp: 'ローマ字変換',
    path: '/tools/romaji-converter',
    description: {
      en: 'Algorithmic conversion of Japanese script (Kana) to Hepburn standard romanization.',
      jp: 'お名前や文章を、一瞬でヘボン式ローマ字に変換します。'
    },
    icon: Type,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.CHART_MAKER,
    name: 'Chart Maker',
    nameJp: 'かんたんグラフ作成',
    path: '/tools/chart-maker',
    description: {
      en: 'Instant visualization of tabular data into vector-based charts.',
      jp: 'データを貼り付けるだけで、きれいなグラフがすぐに作れます。'
    },
    icon: BarChart3,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.CALORIE_CHECKER,
    name: 'Calorie Checker',
    nameJp: 'カロリー計算',
    path: '/tools/calorie-checker',
    description: {
      en: 'Calculation of BMR and TDEE based on anthropometric data.',
      jp: '身長や体重から、1日に必要なカロリーや基礎代謝を計算します。'
    },
    icon: Activity,
    isImplemented: true,
    category: 'Health'
  },
  {
    id: ToolId.PALETTE_GEN,
    name: 'Palette Gen',
    nameJp: '配色ジェネレータ',
    path: '/tools/palettegen',
    description: {
      en: 'Algorithmic color scheme generation based on color theory.',
      jp: 'ひとつの色を選ぶだけで、相性の良い色を見つけてくれます。デザインや資料作成に。'
    },
    icon: Palette,
    isImplemented: true,
    category: 'Design'
  }
];