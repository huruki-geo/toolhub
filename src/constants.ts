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
  Watch,
  PenTool,
  Calendar,
  Lock,
  Binary,
  StretchHorizontal,
  Quote,
  FileText,
  Receipt,
  Box,
  Brain,
  ListOrdered
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
    id: ToolId.MINUTES_FORMATTER,
    name: 'Minutes Formatter',
    nameJp: '議事録フォーマット自動整形',
    path: '/tools/minutes-formatter',
    description: {
      en: 'Auto-format rough meeting notes into structured minutes with headings and todos.',
      jp: '雑に打ったメモを、見出し・箇条書き・決定事項に整理された議事録形式へ自動整形します。'
    },
    icon: FileText,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.GANTT_CHART,
    name: 'Lightweight Gantt',
    nameJp: '超軽量ガントチャート',
    path: '/tools/gantt-chart',
    description: {
      en: 'Simple task dependency visualizer. No sign-up required.',
      jp: 'タスクと期間を入力するだけで、シンプルなガントチャートを作成・画像保存できます。'
    },
    icon: StretchHorizontal,
    isImplemented: true,
    category: 'Productivity'
  },
  {
    id: ToolId.INVOICE_GENERATOR,
    name: 'Invoice Generator',
    nameJp: '簡易伝票ジェネレーター',
    path: '/tools/invoice-generator',
    description: {
      en: 'Create simple invoices and estimates for freelancers. Export as image.',
      jp: '個人事業主向けのシンプルな見積書・請求書作成ツール。PDFや画像として保存可能。'
    },
    icon: Receipt,
    isImplemented: true,
    category: 'Utility'
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
    id: ToolId.SVG_EDITOR,
    name: 'SVG Editor',
    nameJp: 'SVGベクターエディタ',
    path: '/tools/svg-editor',
    description: {
      en: 'Simple vector graphics editor for creating shapes and text.',
      jp: 'ブラウザ上で図形やテキストを配置してSVG画像を作成できます。'
    },
    icon: PenTool,
    isImplemented: true,
    category: 'Design'
  },
  {
    id: ToolId.CALENDAR_EDITOR,
    name: 'Calendar Editor',
    nameJp: 'カレンダー作成',
    path: '/tools/calendar-editor',
    description: {
      en: 'Design custom monthly calendars with images and events.',
      jp: '好きな画像を背景にして、オリジナルのカレンダー画像を作成できます。'
    },
    icon: Calendar,
    isImplemented: true,
    category: 'Design'
  },
  {
    id: ToolId.TIER_MAKER,
    name: 'Tier List Maker',
    nameJp: 'Tier表作成ツール',
    path: '/tools/tier-maker',
    description: {
      en: 'Create tier lists (S/A/B/C) by dragging and dropping items.',
      jp: 'ドラッグ＆ドロップで、簡単にS〜Dランクの格付け表（Tier表）を作成できます。'
    },
    icon: ListOrdered,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.CRYPTO_TOOL,
    name: 'Crypto Tool',
    nameJp: '暗号化・復号化',
    path: '/tools/crypto-tool',
    description: {
      en: 'Simple encryption and decryption tools (Caesar, Base64, etc).',
      jp: 'シーザー暗号やBase64など、テキストを簡単に暗号化・復号化して遊べます。'
    },
    icon: Lock,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.ENCODING_CONVERTER,
    name: 'Encoding Converter',
    nameJp: '文字コード変換',
    path: '/tools/encoding-converter',
    description: {
      en: 'Convert text between various formats (URL, HTML, Hex).',
      jp: 'URLエンコードやHTML実体参照など、テキストを様々な形式に変換します。'
    },
    icon: Binary,
    isImplemented: true,
    category: 'Utility'
  },
  {
    id: ToolId.QUOTE_FORMATTER,
    name: 'Quote Formatter',
    nameJp: '引用符整形ツール',
    path: '/tools/quote-formatter',
    description: {
      en: 'Format Japanese text with proper corner brackets and nesting.',
      jp: '文章中の会話文や引用を「」『』に自動整形し、ネストを整理します。'
    },
    icon: Quote,
    isImplemented: true,
    category: 'Utility'
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
  },
  {
    id: ToolId.VOXEL_EDITOR,
    name: 'Voxel Editor',
    nameJp: 'ボクセルエディタ',
    path: 'https://voxel.toolpark.info', // 外部URLを直接指定
    description: {
      en: 'Create 3D voxel art directly in your browser. Build, sculpt, and export 3D models without installation.',
      jp: 'ブラウザ上で3Dボクセルアートを作成。インストール不要で3Dモデリングが可能です。'
    },
    icon: Box, // lucide-reactからimport
    isImplemented: true,
    category: 'Design',
    isExternal: true // 新しいフラグを追加
  },
  {
    id: ToolId.ALETHEIA,
    name: 'Aletheia',
    nameJp: '論理検証ツール',
    path: 'https://aletheia.toolpark.info',
    description: {
      en: 'Analyze logical fallacies and argument structures in text. Improve critical thinking and rhetoric.',
      jp: '文章中の論理的誤謬や議論の構造を分析。批判的思考力を鍛えるツールです。'
    },
    icon: Brain, // lucide-reactからimport
    isImplemented: true,
    category: 'Utility',
    isExternal: true
  }
];

// TypeScriptの型推論のためにexport
export type { ToolMeta };