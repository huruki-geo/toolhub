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
      
      <h2>Key Features</h2>
      <ul>
        <li><strong>Countdown Timer</strong>: Set hours, minutes, and seconds. Notifies you with an alarm when finished.</li>
        <li><strong>Visual Progress</strong>: Background changes as time passes, allowing intuitive time tracking.</li>
        <li><strong>Stopwatch</strong>: Accurate millisecond measurement and lap time recording.</li>
        <li><strong>Custom Alarm</strong>: Set your own audio file as the alarm sound.</li>
        <li><strong>Large Screen Mode</strong>: Maximizes text size for visibility from a distance.</li>
      </ul>

      <h2>Use Cases</h2>
      <ul>
        <li>Study and Pomodoro Technique</li>
        <li>Kitchen timer for cooking</li>
        <li>Time measurement for sports and training</li>
        <li>Presentation time management</li>
      </ul>
    `
  },

  "/tools/focus-timer": {
    title: "Focus & Cycle Timer (Pomodoro/HIIT) | ToolPark.info",
    description: "Interval timer perfect for Pomodoro Technique and HIIT training. Features background music settings for work/break and presets like 52/17 rule.",
    content: `
      <h1>Focus & Cycle Timer</h1>
      <p>An interval timer for alternating between work and breaks. Perfect for creating rhythm and focus, such as Pomodoro Technique or HIIT (High-Intensity Interval Training).</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Flexible Segments</strong>: Freely set and loop cycles like 'Focus 25min' -> 'Break 5min'.</li>
        <li><strong>BGM Function</strong>: Set different BGM (audio files) for each segment. Play focus music during work and relaxing music during breaks.</li>
        <li><strong>Rich Presets</strong>: Includes scientifically based templates like Pomodoro, 52/17 rule, Ultradian Rhythm, HIIT/Tabata.</li>
        <li><strong>Visual Themes</strong>: Background color changes for each segment to show current status at a glance.</li>
      </ul>
      
      <h2>Recommended Uses</h2>
      <p>Use for productivity in work/study, interval management in muscle training, or as a timer for meditation and yoga.</p>
    `
  },

  "/tools/log-timer": {
    title: "Log Timer (Time Tracking) | ToolPark.info",
    description: "A log tool that records 'what you are doing now' while measuring time. Switch tasks with one click. Export daily work history to CSV.",
    content: `
      <h1>Log Timer</h1>
      <p>A time tracking tool that measures task duration and records it as a timeline. Useful for freelance time management and visualizing study records.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>One-Click Switching</strong>: Just click tags like 'Work', 'Break', 'Chore' to end the previous timer and start the next.</li>
        <li><strong>Real-time Log</strong>: Daily work history stacks up in a timeline format.</li>
        <li><strong>Data Export</strong>: Download recorded logs as text or CSV. Useful for daily reports and analysis.</li>
        <li><strong>Custom Tags</strong>: Freely add your own task names or project names.</li>
      </ul>
    `
  },

  "/tools/multi-timer": {
    title: "Multi Timer - Manage Multiple Timers | ToolPark.info",
    description: "Run multiple timers simultaneously in your browser. Perfect for multitasking, like managing pasta boiling time and sauce cooking time in parallel.",
    content: `
      <h1>Multi Timer</h1>
      <p>A tool to launch and manage multiple kitchen timers simultaneously in your browser. Name individual timers and start/stop/reset them independently.</p>

      <h2>Use Cases</h2>
      <ul>
        <li><strong>Cooking</strong>: Manage Pasta (8min), Sauce (15min), Oven (30min) at the same time.</li>
        <li><strong>Experiments/Research</strong>: Measure multiple process times in parallel.</li>
        <li><strong>Multiple Deadlines</strong>: Display remaining time for short-term tasks side by side.</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>Unlimited timer addition/deletion.</li>
        <li>Individual naming.</li>
        <li>Alarm notification upon completion (audio customizable).</li>
      </ul>
    `
  },

  "/tools/habitpal": {
    title: "Habit Pal - Simple Habit Tracker | ToolPark.info",
    description: "Simply record daily habits and tasks. Privacy-focused habit management tool requiring no login, saving data to your browser.",
    content: `
      <h1>Habit Pal</h1>
      <p>A simple tracker to record habit achievements like 'Drink 2L water' or 'Read 15 mins'. Also features task management functions for daily To-Do lists.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Habit Log</strong>: View past week's achievements in a calendar format. Automatically calculates streaks.</li>
        <li><strong>Task Memo</strong>: Simple To-Do list to manage completion status.</li>
        <li><strong>Local Storage</strong>: Data is saved to your browser (LocalStorage) and not sent to external servers. Record privately.</li>
      </ul>
    `
  },

  "/tools/browser-notepad": {
    title: "Browser Notepad - Auto-saving Editor | ToolPark.info",
    description: "Simple notepad with auto-save functionality that persists even after closing tabs. Features character/line count and date insertion.",
    content: `
      <h1>Browser Notepad</h1>
      <p>High-functionality notepad usable instantly by opening the browser. Input is auto-saved in real-time to the browser, so it's safe even if you close the tab.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Auto-Save</strong>: Input is instantly saved to LocalStorage. Resume editing next time you access.</li>
        <li><strong>Character Count</strong>: Displays character and line counts in real-time. Useful for reports and drafting.</li>
        <li><strong>Utility Tools</strong>: One-click date/time insertion, copy button, and download as text file (.txt).</li>
      </ul>
    `
  },

  "/tools/pixel-editor": {
    title: "Pixel Editor | ToolPark.info",
    description: "Free tool to draw pixel art easily on smartphone or PC. Equipped with pen, fill, and shape drawing functions with layer-like feel.",
    content: `
      <h1>Pixel Editor</h1>
      <p>Lightweight pixel art creation tool running in the browser. Perfect for icon creation, game assets, and hobby pixel art.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Rich Tools</strong>: Equipped with Pen, Eraser, Fill, Dropper, Line, Rectangle, and Circle tools.</li>
        <li><strong>Canvas Resizing</strong>: Choose sizes like 16x16, 32x32, 48x48, 64x64 to suit your needs.</li>
        <li><strong>Color Palette</strong>: Select from curated presets or pick any color freely.</li>
        <li><strong>Undo Function</strong>: History function allows you to quickly undo mistakes.</li>
        <li><strong>PNG Export</strong>: Download your created pixel art as a PNG image.</li>
      </ul>
    `
  },

  "/tools/svg-editor": {
    title: "SVG Vector Editor | ToolPark.info",
    description: "Free vector graphics editor usable in browser. Arrange shapes, circles, text and save as SVG.",
    content: `
      <h1>SVG Vector Editor</h1>
      <p>Simple vector drawing tool requiring no installation. Created graphics can be downloaded as SVG files, suitable for website assets and print.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Basic Shapes</strong>: Place rectangles, circles, triangles, and text.</li>
        <li><strong>Property Edit</strong>: Adjust position, size, color, opacity, and rotation.</li>
        <li><strong>SVG Export</strong>: Export in standard SVG format. Editable in tools like Illustrator.</li>
      </ul>
    `
  },

  "/tools/calendar-editor": {
    title: "Calendar Editor | ToolPark.info",
    description: "Create and download custom monthly calendars with your favorite background images. Perfect for wallpapers and printing.",
    content: `
      <h1>Calendar Editor</h1>
      <p>Create your own calendar images by uploading your favorite photos. Make smartphone wallpapers or desktop calendars using photos of your idols or pets.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Background Image</strong>: Upload and set your own images as background.</li>
        <li><strong>Design Adjustment</strong>: Adjust text color and background opacity for better visibility.</li>
        <li><strong>High Res Save</strong>: Save created calendars as high-resolution PNG images.</li>
      </ul>
    `
  },

  "/tools/crypto-tool": {
    title: "Crypto Tool | ToolPark.info",
    description: "Encrypt and decrypt text using various methods like Caesar Cipher, ROT13, Base64, Hex.",
    content: `
      <h1>Crypto Tool</h1>
      <p>Learning tool to easily encrypt text messages for secret exchanges with friends or checking data encoding.</p>

      <h2>Supported Algorithms</h2>
      <ul>
        <li><strong>Caesar Cipher</strong>: Classic cipher shifting letters by a set number.</li>
        <li><strong>ROT13</strong>: Shifts alphabet by 13 characters. Often used for spoiler prevention.</li>
        <li><strong>Base64</strong>: Encoding method representing data with 64 characters.</li>
        <li><strong>Hex</strong>: Converts strings to hexadecimal codes.</li>
      </ul>
    `
  },

  "/tools/encoding-converter": {
    title: "Encoding Converter | ToolPark.info",
    description: "Batch convert text to various formats like URL Encode, HTML Entities, Unicode Escape.",
    content: `
      <h1>Encoding Converter</h1>
      <p>Text conversion tool useful for programming and web development. Converts input text to multiple formats simultaneously.</p>

      <h2>Conversion Formats</h2>
      <ul>
        <li><strong>URL Encode</strong>: Convert text to URL-safe format (%E3%81%82...).</li>
        <li><strong>Base64</strong>: Encode data to Base64 string.</li>
        <li><strong>HTML Entities</strong>: Convert special characters to HTML entities (&amp;#12354;...).</li>
        <li><strong>Unicode Escape</strong>: Convert to Unicode escape sequences (\\u3042...).</li>
        <li><strong>Hex (UTF-8)</strong>: Display UTF-8 byte sequence in hexadecimal.</li>
      </ul>
    `
  },

  "/tools/tax-threshold-checker": {
    title: "Tax Threshold Checker (Japan) | ToolPark.info",
    description: "Simply input part-time income to calculate remaining allowance until the 1.03 million yen (Income Tax) and 1.3 million yen (Social Insurance) walls.",
    content: `
      <h1>Tax Threshold Checker</h1>
      <p>Simulation tool for the 'Annual Income Walls' that concern students and spouses in Japan. Input expected annual income to see remaining amount until dependency deduction or social insurance limits.</p>

      <h2>Supported Thresholds</h2>
      <ul>
        <li><strong>1.03 Million Yen Wall</strong>: Line where income tax begins. Affects dependency deduction for parents/spouses.</li>
        <li><strong>1.30 Million Yen Wall</strong>: Line where joining social insurance (Health/Pension) becomes necessary. Significantly affects take-home pay.</li>
        <li><strong>1.50 Million Yen Wall</strong>: Line where Spousal Special Deduction is no longer fully received.</li>
      </ul>
      
      <p>* This tool is a rough simulation. Please confirm exact tax amounts and premiums with your municipality or employer.</p>
    `
  },

  "/tools/schedule-formatter": {
    title: "Schedule Formatter | ToolPark.info",
    description: "Sorts messy schedule notes like '1000 Meeting' chronologically and formats them neatly. Auto-calculates duration and saves as image.",
    content: `
      <h1>Schedule Formatter</h1>
      <p>Tool that instantly organizes rough schedule notes using algorithms (no AI). Useful for creating time schedules and organizing daily reports.</p>

      <h2>Usage & Features</h2>
      <ul>
        <li><strong>Auto Sort</strong>: Parses text like '0900 Morning Meeting' or '18:30 Dinner' and sorts them chronologically.</li>
        <li><strong>Duration Calc</strong>: Automatically calculates and displays free time or work duration until the next event.</li>
        <li><strong>Category Coloring</strong>: Detects keywords like 'Meal', 'Travel', 'Meeting' and automatically color-codes them.</li>
        <li><strong>Image Export</strong>: Save formatted schedules as beautiful images to share on SNS or chat.</li>
      </ul>
    `
  },

  "/tools/romaji-converter": {
    title: "Romaji Converter Pro | ToolPark.info",
    description: "Batch converts Japanese (Hiragana/Katakana) to Romaji. Supports Hepburn/Kunrei switching and reverse Romaji-to-Kana conversion.",
    content: `
      <h1>Romaji Converter Pro</h1>
      <p>Tool to support 'Romaji conversion of Japanese names and addresses' needed for business cards, passports, and data entry. Reverse conversion helps with Romaji typing practice.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Hepburn/Kunrei Support</strong>: One-click switch between standard Hepburn (Passport) and Kunrei (School) styles.</li>
        <li><strong>Case Conversion</strong>: Unify casing variations like 'Yamada Taro', 'YAMADA TARO', 'yamada taro'.</li>
        <li><strong>Reverse Mode</strong>: Input Romaji (nippon) to convert to Japanese (にっぽん).</li>
        <li><strong>Long Vowels/Sokuon</strong>: Handles special rules like 'Ono/Ohno' or 'Hattori'.</li>
      </ul>
    `
  },

  "/tools/chart-maker": {
    title: "Chart Maker | ToolPark.info",
    description: "Create and save beautiful charts for presentations just by pasting data. Supports Bar, Line, Pie, Histogram, and more.",
    content: `
      <h1>Chart Maker</h1>
      <p>Create charts quickly in your browser without opening Excel. Just paste CSV formatted text data to visualize instantly.</p>

      <h2>Supported Chart Types</h2>
      <ul>
        <li>Bar Chart</li>
        <li>Line Chart</li>
        <li>Pie / Donut Chart</li>
        <li>Band Graph</li>
        <li>Pictogram</li>
        <li>Histogram</li>
        <li>Box Plot</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li><strong>Image Save</strong>: Download charts as transparent PNGs to paste directly into PowerPoint or Keynote.</li>
        <li><strong>Customization</strong>: Finely adjust colors, axis labels, max values, etc.</li>
      </ul>
    `
  },

  "/tools/calorie-checker": {
    title: "Calorie & BMI Calculator | ToolPark.info",
    description: "Calculate BMI, Ideal Weight, BMR, and TDEE from height, weight, and age. For diet and health management.",
    content: `
      <h1>Calorie & BMI Calculator</h1>
      <p>Comprehensive calculator for numbers needed for health maintenance and body make-up based on your body metrics. Save results as an easy-to-read report image.</p>

      <h2>Calculation Items</h2>
      <ul>
        <li><strong>BMI (Body Mass Index)</strong>: Obesity check. Objectively check if underweight or overweight.</li>
        <li><strong>Ideal/Beauty Weight</strong>: Calculate healthy weight and appearance-focused beauty weight.</li>
        <li><strong>BMR (Basal Metabolic Rate)</strong>: Minimum calories burned doing nothing.</li>
        <li><strong>TDEE (Total Daily Energy Expenditure)</strong>: Estimated actual daily calorie burn considering activity level.</li>
        <li><strong>Water Intake</strong>: Daily recommended water amount.</li>
      </ul>
    `
  },

  "/tools/palettegen": {
    title: "Palette Generator | ToolPark.info",
    description: "Auto-generates harmonious color schemes from a single base color based on color theory. For web design and illustration.",
    content: `
      <h1>Palette Generator</h1>
      <p>Tool for when you're stuck on 'color combinations' for design or documents. Select one main color to get harmonious palette proposals based on color theory.</p>

      <h2>Generated Schemes</h2>
      <ul>
        <li><strong>Monochromatic</strong>: Unified scheme using shades of the same color.</li>
        <li><strong>Analogous</strong>: Natural and familiar scheme using adjacent colors on the wheel.</li>
        <li><strong>Complementary</strong>: High contrast accent scheme using opposite colors.</li>
        <li><strong>Triadic</strong>: Balanced and vibrant scheme using three colors equally spaced on the wheel.</li>
      </ul>

      <p>Generated color codes can be copied with one click for immediate use in design tools.</p>
    `
  }
};