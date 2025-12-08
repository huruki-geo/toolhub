import { PageConfig } from './pages';

const DEFAULT_CONFIG: PageConfig = {
  title: "ToolPark.info - Simple & Free Web Tools",
  description: "Privacy-focused, lightweight web tools collection. Timer, Calculator, Chart Maker, and more. No installation required.",
  content: `
    <h1>ToolPark.info - Smart Toolbox</h1>
    <p>ToolPark.info is a collection of free, registration-free web tools. No app installation or login required. Just open your browser and start using them instantly.</p>
    
    <h2>Tool Collection</h2>
    <ul>
      <li><strong>Simple Timer</strong>: Full-screen countdown timer and stopwatch.</li>
      <li><strong>Focus Timer</strong>: Interval timer optimized for Pomodoro and HIIT.</li>
      <li><strong>Log Timer</strong>: Time tracking tool that records task duration and exports to CSV.</li>
      <li><strong>Multi Timer</strong>: Manage multiple kitchen timers simultaneously in parallel.</li>
      <li><strong>Habit Pal</strong>: Record and manage daily habits and tasks directly in your browser.</li>
      <li><strong>Browser Notepad</strong>: Lightweight text editor with auto-save functionality.</li>
      <li><strong>Pixel Editor</strong>: Pixel art creation tool easy to use on smartphones.</li>
      <li><strong>SVG Vector Editor</strong>: Create SVG graphics with shapes and text in your browser.</li>
      <li><strong>Calendar Editor</strong>: Create custom monthly calendars with your own background images.</li>
      <li><strong>Crypto Tool</strong>: Encrypt and decrypt text using Caesar cipher, Base64, etc.</li>
      <li><strong>Encoding Converter</strong>: Convert text between URL encode, HTML entities, etc.</li>
      <li><strong>Tax Threshold Checker</strong>: Simulate income thresholds (Japan Tax System: 1.03M/1.3M wall).</li>
      <li><strong>Schedule Formatter</strong>: Automatically sorts and formats rough schedule notes chronologically.</li>
      <li><strong>Romaji Converter</strong>: Converts Japanese Kana to Romaji (Hepburn/Kunrei) and supports reverse conversion.</li>
      <li><strong>Chart Maker</strong>: Generate beautiful chart images simply by pasting data.</li>
      <li><strong>Calorie & BMI Calculator</strong>: Calculate BMR and TDEE based on body metrics.</li>
      <li><strong>Palette Generator</strong>: Create harmonious color palettes based on color theory.</li>
      <li><strong>Lightweight Gantt</strong>: Simple Gantt chart creator for task visualization.</li>
      <li><strong>Quote Formatter</strong>: Auto-format Japanese quotes and nesting.</li>
      <li><strong>Minutes Formatter</strong>: Structure rough meeting notes into proper minutes.</li>
      <li><strong>Invoice Generator</strong>: Create simple invoices/estimates and export as images.</li>
      <li><strong>Tier List Maker</strong>: Create ranking charts (Tier lists) easily.</li>
    </ul>

    <h2>Features</h2>
    <ul>
      <li><strong>Privacy First</strong>: Input data is not sent to servers; it runs essentially within your browser.</li>
      <li><strong>Lightweight & Fast</strong>: No unnecessary loading, starts instantly.</li>
      <li><strong>Responsive</strong>: Works comfortably on PC, tablets, and smartphones.</li>
    </ul>
  `
};

export const PAGES_EN: Record<string, PageConfig> = {
  "/": DEFAULT_CONFIG,

  "/tools/simple-timer": {
    title: "Simple Timer & Stopwatch | ToolPark.info",
    description: "Free high-functionality timer for your browser. Supports full-screen, lap function, and alarm sound settings. Ideal for study, sports, cooking, and presentation management.",
    content: `
      <h1>Simple Timer & Stopwatch</h1>
      <p>A multi-functional timer app you can use immediately in your browser without installation. Features a progress bar for visual time tracking and a stopwatch with lap time recording.</p>
    `
  },

  "/tools/focus-timer": {
    title: "Focus & Cycle Timer (Pomodoro/HIIT) | ToolPark.info",
    description: "Interval timer perfect for Pomodoro Technique and HIIT training. Features background music settings for work/break and presets like 52/17 rule.",
    content: `
      <h1>Focus & Cycle Timer</h1>
      <p>An interval timer for alternating between work and breaks. Perfect for creating rhythm and focus, such as Pomodoro Technique or HIIT (High-Intensity Interval Training).</p>
    `
  },

  "/tools/log-timer": {
    title: "Log Timer (Time Tracking) | ToolPark.info",
    description: "A log tool that records 'what you are doing now' while measuring time. Switch tasks with one click. Export daily work history to CSV.",
    content: `
      <h1>Log Timer</h1>
      <p>A time tracking tool that measures task duration and records it as a timeline. Useful for freelance time management and visualizing study records.</p>
    `
  },

  "/tools/multi-timer": {
    title: "Multi Timer - Manage Multiple Timers | ToolPark.info",
    description: "Run multiple timers simultaneously in your browser. Perfect for multitasking, like managing pasta boiling time and sauce cooking time in parallel.",
    content: `
      <h1>Multi Timer</h1>
      <p>A tool to launch and manage multiple kitchen timers simultaneously in your browser. Name individual timers and start/stop/reset them independently.</p>
    `
  },

  "/tools/habitpal": {
    title: "Habit Pal - Simple Habit Tracker | ToolPark.info",
    description: "Simply record daily habits and tasks. Privacy-focused habit management tool requiring no login, saving data to your browser.",
    content: `
      <h1>Habit Pal</h1>
      <p>A simple tracker to record habit achievements like 'Drink 2L water' or 'Read 15 mins'. Also features task management functions for daily To-Do lists.</p>
    `
  },

  "/tools/browser-notepad": {
    title: "Browser Notepad - Auto-saving Editor | ToolPark.info",
    description: "Simple notepad with auto-save functionality that persists even after closing tabs. Features character/line count and date insertion.",
    content: `
      <h1>Browser Notepad</h1>
      <p>High-functionality notepad usable instantly by opening the browser. Input is auto-saved in real-time to the browser, so it's safe even if you close the tab.</p>
    `
  },

  "/tools/pixel-editor": {
    title: "Pixel Editor | ToolPark.info",
    description: "Free tool to draw pixel art easily on smartphone or PC. Equipped with pen, fill, and shape drawing functions with layer-like feel.",
    content: `
      <h1>Pixel Editor</h1>
      <p>Lightweight pixel art creation tool running in the browser. Perfect for icon creation, game assets, and hobby pixel art.</p>
    `
  },

  "/tools/svg-editor": {
    title: "SVG Vector Editor | ToolPark.info",
    description: "Free vector graphics editor usable in browser. Arrange shapes, circles, text and save as SVG.",
    content: `
      <h1>SVG Vector Editor</h1>
      <p>Simple vector drawing tool requiring no installation. Created graphics can be downloaded as SVG files, suitable for website assets and print.</p>
    `
  },

  "/tools/calendar-editor": {
    title: "Calendar Editor | ToolPark.info",
    description: "Create and download custom monthly calendars with your favorite background images. Perfect for wallpapers and printing.",
    content: `
      <h1>Calendar Editor</h1>
      <p>Create your own calendar images by uploading your favorite photos. Make smartphone wallpapers or desktop calendars using photos of your idols or pets.</p>
    `
  },

  "/tools/crypto-tool": {
    title: "Crypto Tool | ToolPark.info",
    description: "Encrypt and decrypt text using various methods like Caesar Cipher, ROT13, Base64, Hex.",
    content: `
      <h1>Crypto Tool</h1>
      <p>Learning tool to easily encrypt text messages for secret exchanges with friends or checking data encoding.</p>
    `
  },

  "/tools/encoding-converter": {
    title: "Encoding Converter | ToolPark.info",
    description: "Batch convert text to various formats like URL Encode, HTML Entities, Unicode Escape.",
    content: `
      <h1>Encoding Converter</h1>
      <p>Text conversion tool useful for programming and web development. Converts input text to multiple formats simultaneously.</p>
    `
  },

  "/tools/tax-threshold-checker": {
    title: "Tax Threshold Checker (Japan) | ToolPark.info",
    description: "Simply input part-time income to calculate remaining allowance until the 1.03 million yen (Income Tax) and 1.3 million yen (Social Insurance) walls.",
    content: `
      <h1>Tax Threshold Checker</h1>
      <p>Simulation tool for the 'Annual Income Walls' that concern students and spouses in Japan. Input expected annual income to see remaining amount until dependency deduction or social insurance limits.</p>
    `
  },

  "/tools/schedule-formatter": {
    title: "Schedule Formatter | ToolPark.info",
    description: "Sorts messy schedule notes like '1000 Meeting' chronologically and formats them neatly. Auto-calculates duration and saves as image.",
    content: `
      <h1>Schedule Formatter</h1>
      <p>Tool that instantly organizes rough schedule notes using algorithms (no AI). Useful for creating time schedules and organizing daily reports.</p>
    `
  },

  "/tools/romaji-converter": {
    title: "Romaji Converter Pro | ToolPark.info",
    description: "Batch converts Japanese (Hiragana/Katakana) to Romaji. Supports Hepburn/Kunrei switching and reverse Romaji-to-Kana conversion.",
    content: `
      <h1>Romaji Converter Pro</h1>
      <p>Tool to support 'Romaji conversion of Japanese names and addresses' needed for business cards, passports, and data entry. Reverse conversion helps with Romaji typing practice.</p>
    `
  },

  "/tools/chart-maker": {
    title: "Chart Maker | ToolPark.info",
    description: "Create and save beautiful charts for presentations just by pasting data. Supports Bar, Line, Pie, Histogram, and more.",
    content: `
      <h1>Chart Maker</h1>
      <p>Create charts quickly in your browser without opening Excel. Just paste CSV formatted text data to visualize instantly.</p>
    `
  },

  "/tools/calorie-checker": {
    title: "Calorie & BMI Calculator | ToolPark.info",
    description: "Calculate BMI, Ideal Weight, BMR, and TDEE from height, weight, and age. For diet and health management.",
    content: `
      <h1>Calorie & BMI Calculator</h1>
      <p>Comprehensive calculator for numbers needed for health maintenance and body make-up based on your body metrics. Save results as an easy-to-read report image.</p>
    `
  },

  "/tools/palettegen": {
    title: "Palette Generator | ToolPark.info",
    description: "Auto-generates harmonious color schemes from a single base color based on color theory. For web design and illustration.",
    content: `
      <h1>Palette Generator</h1>
      <p>Tool for when you're stuck on 'color combinations' for design or documents. Select one main color to get harmonious palette proposals based on color theory.</p>
    `
  },

  "/tools/gantt-chart": {
    title: "Lightweight Gantt Chart | ToolPark.info",
    description: "Simple task dependency visualizer. Create Gantt charts instantly by inputting tasks and duration. Export as image.",
    content: `
      <h1>Lightweight Gantt Chart</h1>
      <p>No complex project management tools needed. Just input tasks and duration to create a simple Gantt chart instantly.</p>
    `
  },

  "/tools/quote-formatter": {
    title: "Quote Formatter | ToolPark.info",
    description: "Auto-formats straight quotes to Japanese corner brackets and handles nesting logic for clean text.",
    content: `
      <h1>Quote Formatter</h1>
      <p>Automates the cleanup of quotes. Converts straight quotes ("") to Japanese brackets (「」) and handles nested quotes with 『』.</p>
    `
  },

  "/tools/minutes-formatter": {
    title: "Minutes Formatter | ToolPark.info",
    description: "Auto-structures rough meeting notes into formatted minutes with Agenda, Decisions, and Todos.",
    content: `
      <h1>Minutes Formatter</h1>
      <p>Paste your rough meeting notes and convert them into a structured format with clear headings for Agenda, Decisions, and Action Items.</p>
    `
  },

  "/tools/invoice-generator": {
    title: "Invoice Generator | ToolPark.info",
    description: "Simple tool for freelancers to create invoices and estimates. Input details and save as a professional image.",
    content: `
      <h1>Invoice Generator</h1>
      <p>Create professional invoices or estimates quickly in your browser. Perfect for freelancers who need a simple solution without complex software.</p>
    `
  },

  "/tools/tier-maker": {
    title: "Tier List Maker | ToolPark.info",
    description: "Create ranking charts (Tier lists) by dragging and dropping items into S/A/B/C/D tiers.",
    content: `
      <h1>Tier List Maker</h1>
      <p>Create your own Tier List to rank anything from game characters to food. Add items and drop them into the appropriate tier row.</p>
    `
  }
};