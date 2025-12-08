import { PageConfig } from './pages';

const DEFAULT_CONFIG: PageConfig = {
  title: "ToolPark.info - Smart Toolbox | Free & No-Signup Web Tools",
  description: "[No Install / No Ads] A collection of privacy-focused web tools like Timers, Calculators, Pixel Art Editors, Gantt Charts, and more. Data stays in your browser.",
  content: `
    <h1>ToolPark.info - Boost Your Productivity with Smart Tools</h1>
    <p>ToolPark.info is a platform of <strong>free, registration-free web tools</strong> designed for instant use. No app downloads or tedious login processes required. Just bookmark and start optimizing your workflow immediately.</p>
    
    <h2>Why Choose ToolPark.info?</h2>
    <ul>
      <li><strong>Privacy First (Secure)</strong>: Your data (notes, tasks, images, financial inputs) is processed and stored entirely within your browser (LocalStorage). Nothing is sent to our servers, ensuring your privacy.</li>
      <li><strong>Lightweight & Fast (PWA)</strong>: We've eliminated invasive ads and tracking scripts to ensure lightning-fast performance, even on slow connections or older devices.</li>
      <li><strong>Responsive Design</strong>: Whether you are on a desktop for work or a smartphone on the go, our tools adapt perfectly to any screen size.</li>
    </ul>

    <h2>Tool Categories</h2>
    <h3>🕒 Time Management</h3>
    <ul>
      <li><strong>Simple Timer</strong>: Full-screen visual countdown and stopwatch. Great for exams and presentations.</li>
      <li><strong>Focus Timer</strong>: Interval timer optimized for Pomodoro Technique and HIIT workouts.</li>
      <li><strong>Log Timer</strong>: Track time spent on tasks and export to CSV. Ideal for freelancers.</li>
      <li><strong>Multi Timer</strong>: Run multiple timers in parallel. Perfect for cooking and labs.</li>
    </ul>

    <h3>📝 Business & Productivity</h3>
    <ul>
      <li><strong>Lightweight Gantt</strong>: Visualize project timelines and dependencies instantly.</li>
      <li><strong>Invoice Generator</strong>: Create professional estimates and invoices without Excel.</li>
      <li><strong>Minutes Formatter</strong>: Structure rough meeting notes into a clean agenda and to-do list.</li>
      <li><strong>Schedule Formatter</strong>: Instantly convert messy text notes into a chronological agenda.</li>
      <li><strong>Habit Pal</strong>: Track daily routines and visualize your streaks with a heat map.</li>
    </ul>

    <h3>🎨 Creative & Design</h3>
    <ul>
      <li><strong>Tier List Maker</strong>: Create ranking charts for games, anime, or community events.</li>
      <li><strong>Pixel Editor</strong>: Create 8-bit pixel art and sprites directly in your browser.</li>
      <li><strong>SVG Vector Editor</strong>: Create scalable vector graphics (SVG) with shapes and text.</li>
      <li><strong>Palette Generator</strong>: Generate harmonious color schemes based on color theory.</li>
      <li><strong>Calendar Editor</strong>: Create custom wallpapers using your favorite photos.</li>
      <li><strong>Chart Maker</strong>: Create professional charts for presentations without spreadsheet software.</li>
    </ul>

    <h3>💻 Dev & Utilities</h3>
    <ul>
      <li><strong>Browser Notepad</strong>: Auto-saving text editor. Never lose your ideas again.</li>
      <li><strong>Crypto Tool</strong>: Encrypt/Decrypt text with Caesar, ROT13, Base64 for learning.</li>
      <li><strong>Encoding Converter</strong>: URL Encode, HTML Entities, and Unicode escaping.</li>
      <li><strong>Quote Formatter</strong>: Auto-format Japanese quotes for novelists and translators.</li>
    </ul>

    <h3>🧮 Calculation & Simulation</h3>
    <ul>
      <li><strong>Calorie & BMI Calculator</strong>: Calculate BMR and TDEE for scientific weight management.</li>
      <li><strong>Tax Threshold Checker (Japan)</strong>: Simulate income limits (1.03M/1.3M walls) for part-timers in Japan.</li>
      <li><strong>Romaji Converter</strong>: Convert Japanese Kana to Romaji (Hepburn/Kunrei) instantly.</li>
    </ul>
  `
};

export const PAGES_EN: Record<string, PageConfig> = {
  "/": DEFAULT_CONFIG,

  "/tools/simple-timer": {
    title: "Simple Timer & Stopwatch | Full Screen & Custom Audio | ToolPark.info",
    description: "Free online timer with visual progress bar and stopwatch. Features full-screen mode, millisecond precision, and custom alarm sounds. Perfect for studying, cooking, and sports.",
    content: `
      <h1>Simple Timer & Stopwatch</h1>
      <p>The ToolPark.info Simple Timer focuses on <strong>"Time Visualization"</strong>. It helps you manage time effectively without installing any apps. Accessible instantly from any PC or smartphone browser.</p>
      
      <h2>Key Features & Use Cases</h2>
      <ul>
        <li><strong>Visual Countdown</strong>: The background color changes and a progress bar advances as time counts down. You can intuitively grasp "how much time is left" without staring at the numbers.</li>
        <li><strong>High-Precision Stopwatch</strong>: Supports measurement down to the millisecond (1/100s). Includes a <strong>Lap Time</strong> function, making it ideal for sports training or measuring work speed.</li>
        <li><strong>Custom Alarm Sound</strong>: Upload your own audio file (mp3/wav) to use as the alarm. Wake up or stop working to your favorite song.</li>
      </ul>
    `
  },

  "/tools/focus-timer": {
    title: "Focus & Cycle Timer (Pomodoro/HIIT) | ToolPark.info",
    description: "Interval timer designed for the Pomodoro Technique (25+5) and HIIT. Customizable work/break intervals and background music to maximize concentration.",
    content: `
      <h1>Focus & Cycle Timer (Pomodoro/HIIT)</h1>
      <p>Human concentration is limited. Appropriate breaks are the key to sustained performance. This tool is an advanced interval timer specifically designed for alternating between <strong>Focus (Work)</strong> and <strong>Rest (Break)</strong>.</p>

      <h2>Scientifically Proven Presets</h2>
      <ul>
        <li><strong>Pomodoro Technique</strong>: "25min Focus + 5min Break". A world-famous method to maintain high productivity.</li>
        <li><strong>HIIT / Tabata</strong>: "20sec Intensity + 10sec Rest" x 8 sets. Boosts cardiopulmonary function and fat burning.</li>
        <li><strong>52/17 Rule</strong>: The "Golden Ratio" of productivity for desk work. Prevents burnout during long working hours.</li>
      </ul>
    `
  },

  "/tools/log-timer": {
    title: "Log Timer (Time Tracking) | Export to CSV | ToolPark.info",
    description: "Track 'what you are doing' and 'how long'. Switch tasks with one click and export your daily timeline to CSV. Essential for freelancers and time audits.",
    content: `
      <h1>Log Timer (Time Tracking)</h1>
      <p>Time is your most valuable resource. The Log Timer allows you to visualize how you spend your day and perform a "Time Audit" to improve productivity.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>One-Click Switching</strong>: Just click buttons like "Work" or "Meeting." It automatically stops the previous timer and starts the new one. No gaps in your records.</li>
        <li><strong>CSV Export</strong>: Download your data as a CSV file. Import it into Excel or Google Sheets to create graphs and analyze your monthly performance or create invoices.</li>
      </ul>
    `
  },

  "/tools/multi-timer": {
    title: "Multi Timer | Manage Multiple Countdowns Parallel | ToolPark.info",
    description: "Run multiple timers simultaneously in your browser. Name each timer individually. Perfect for complex cooking, lab experiments, and multitasking.",
    content: `
      <h1>Multi Timer</h1>
      <p>A tool that lets you run and manage multiple independent timers on a single screen. Powerful support for multitasking where parallel processing is required.</p>

      <h2>Use Cases</h2>
      <ul>
        <li><strong>Cooking</strong>: Manage Pasta, Sauce, and Oven times simultaneously.</li>
        <li><strong>Science & Labs</strong>: Measure reaction times of multiple samples in parallel.</li>
        <li><strong>Time Boxing</strong>: Set limits for multiple tasks like "10 mins for email," "45 mins for report" to gamify your work.</li>
      </ul>
    `
  },

  "/tools/habitpal": {
    title: "Habit Pal | Habit Tracker & Streak Manager | ToolPark.info",
    description: "Build new habits with the 'Don't Break the Chain' method. Visualize progress with a heatmap calendar. Privacy-focused and login-free.",
    content: `
      <h1>Habit Pal (Habit Tracker)</h1>
      <p>It takes time to build a new habit. Habit Pal is your partner in recording small daily wins and maintaining motivation using the "Don't Break the Chain" method.</p>

      <h2>Why it Works</h2>
      <ul>
        <li><strong>Streak Calculation</strong>: Seeing your continuous streak count leverages the psychological principle of "Loss Aversion"—you won't want to break the chain.</li>
        <li><strong>Privacy First</strong>: Your personal goals and habits are stored locally in your browser, not on our servers.</li>
      </ul>
    `
  },

  "/tools/browser-notepad": {
    title: "Browser Notepad | Auto-Save & Character Count | ToolPark.info",
    description: "Instant online text editor. Content is auto-saved to your browser. Features character/line counter and file download. No cloud login needed.",
    content: `
      <h1>Browser Notepad</h1>
      <p>"I need to jot something down quickly." This tool is the answer. A lightweight browser-based text editor with zero loading time.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Reliable Auto-Save</strong>: Every character you type is instantly saved to Local Storage. Even if you close the tab, your text is safe.</li>
        <li><strong>Real-time Counters</strong>: Displays character and line counts. Essential for drafting tweets, essays, or reports with length limits.</li>
      </ul>
    `
  },

  "/tools/pixel-editor": {
    title: "Pixel Editor | Free Online Pixel Art Maker | ToolPark.info",
    description: "Create pixel art and sprites in your browser. Supports mobile touch and mouse. Export to transparent PNG. Canvas sizes from 16x16 to 64x64.",
    content: `
      <h1>Pixel Editor</h1>
      <p>Create retro-style "Pixel Art" right in your browser. No expensive graphic software needed. Designed to be easy to use on both PC mouse and smartphone touch screens.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Layer-like Experience</strong>: Includes Undo/Redo history functions.</li>
        <li><strong>Various Sizes</strong>: From 16x16 (Favicon) to 64x64 (Avatars/Assets).</li>
        <li><strong>PNG Export</strong>: Save your work as a transparent PNG, ready for game development or social media.</li>
      </ul>
    `
  },

  "/tools/svg-editor": {
    title: "SVG Vector Editor | Create Scalable Graphics | ToolPark.info",
    description: "Browser-based vector graphics editor. Create shapes, text, and designs that don't lose quality when resized. Save as SVG file.",
    content: `
      <h1>SVG Vector Editor</h1>
      <p>A simple vector drawing tool that allows you to create graphics without installing heavy software like Illustrator. Created images are saved as SVG files, which are perfect for web logos and icons.</p>

      <h2>Benefits of SVG (Vector)</h2>
      <ul>
        <li><strong>No Quality Loss</strong>: Lines remain smooth no matter how much you zoom in or resize.</li>
        <li><strong>Lightweight</strong>: File sizes are significantly smaller than photos (raster images), improving website loading speed.</li>
      </ul>
    `
  },

  "/tools/calendar-editor": {
    title: "Calendar Editor | Custom Wallpaper Maker | ToolPark.info",
    description: "Create and download custom monthly calendars with your favorite background images. Perfect for smartphone lock screens and printable desk calendars.",
    content: `
      <h1>Calendar Editor</h1>
      <p>A generator that lets you create original calendar images by uploading your own photos. Use photos of your "Faves" (Idols), pets, or travel memories.</p>

      <h2>Ideas for Use</h2>
      <ul>
        <li><strong>Lock Screen</strong>: Embed this month's calendar into your phone wallpaper.</li>
        <li><strong>Printables</strong>: Print your creation to make a unique DIY desk calendar.</li>
      </ul>
    `
  },

  "/tools/crypto-tool": {
    title: "Crypto Tool | Caesar, Base64, ROT13 | ToolPark.info",
    description: "Encrypt and decrypt text using various methods. Great for learning cybersecurity basics, CTF challenges, or secret messages.",
    content: `
      <h1>Crypto Tool</h1>
      <p>A learning tool to easily encrypt (encode) and decrypt (decode) text messages using various algorithms. Useful for CTF (Capture The Flag) practice or programming study.</p>

      <h2>Supported Algorithms</h2>
      <ul>
        <li><strong>Caesar Cipher</strong>: A classic cipher that shifts alphabets by a set number.</li>
        <li><strong>ROT13</strong>: A substitution cipher often used to hide spoilers.</li>
        <li><strong>Base64</strong>: Encoding binary data into text format.</li>
        <li><strong>Hashing</strong>: Generate MD5/SHA hashes (One-way encryption).</li>
      </ul>
    `
  },

  "/tools/encoding-converter": {
    title: "Encoding Converter | URL Encode & HTML Entities | ToolPark.info",
    description: "Batch convert text to various formats like URL Encode, HTML Entities, Unicode Escape. Essential for web developers.",
    content: `
      <h1>Encoding Converter</h1>
      <p>A developer utility to convert text formats instantly. See how your string looks in different encodings simultaneously.</p>

      <h2>Main Formats</h2>
      <ul>
        <li><strong>URL Encode</strong>: Safely encode characters for use in URLs (e.g., %20 for space).</li>
        <li><strong>HTML Entities</strong>: Convert special chars like &lt; and &amp; for HTML display.</li>
        <li><strong>Unicode Escape</strong>: Convert to \\uXXXX format used in Java/JavaScript.</li>
      </ul>
    `
  },

  "/tools/tax-threshold-checker": {
    title: "Tax Threshold Checker (Japan) | Income Wall Simulation | ToolPark.info",
    description: "For residents in Japan. Calculate remaining income allowance for the 1.03 million yen (Tax) and 1.30 million yen (Social Insurance) walls.",
    content: `
      <h1>Tax Threshold Checker (Japan Income Walls)</h1>
      <p>For part-time workers in Japan, the "Annual Income Walls" are a critical concern. This tool simulates these rules to help you adjust your shifts.</p>

      <h2>Supported Walls</h2>
      <ul>
        <li><strong>1.03 Million Yen Wall</strong>: The line where Income Tax begins.</li>
        <li><strong>1.30 Million Yen Wall</strong>: The line where you lose dependency status for Social Insurance (Health/Pension), significantly impacting net pay.</li>
      </ul>
    `
  },

  "/tools/schedule-formatter": {
    title: "Schedule Formatter | Organize Messy Notes | ToolPark.info",
    description: "Convert rough text notes like '10am Meeting' into a sorted, beautiful agenda. Auto-calculates duration and free time.",
    content: `
      <h1>Schedule Formatter</h1>
      <p>Dump your brain's rough schedule into the text box, and our algorithm will organize it instantly. Perfect for sorting out your day before entering it into a formal calendar.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Auto-Sort</strong>: Inputs are automatically sorted chronologically.</li>
        <li><strong>Duration Calc</strong>: Automatically calculates time gaps and task duration.</li>
        <li><strong>Image Export</strong>: Save your organized schedule as an image to share on social media or team chat.</li>
      </ul>
    `
  },

  "/tools/romaji-converter": {
    title: "Romaji Converter Pro | Hepburn & Kunrei | ToolPark.info",
    description: "Convert Japanese Kana to Romaji instantly. Supports Passport style (Hepburn) and School style (Kunrei). Includes reverse conversion.",
    content: `
      <h1>Romaji Converter Pro</h1>
      <p>A professional tool to convert Japanese (Hiragana/Katakana) into Romaji (Latin script). Essential for business cards, passports, and data entry.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Hepburn / Kunrei</strong>: Switch between the standard Passport style (Hepburn) and the Japanese academic style (Kunrei).</li>
        <li><strong>Reverse Mode</strong>: Convert Romaji back to Japanese Kana. Useful for typing practice.</li>
      </ul>
    `
  },

  "/tools/chart-maker": {
    title: "Chart Maker | Create Graphs Online Free | ToolPark.info",
    description: "No Excel needed. Paste data to generate professional Bar, Line, Pie, and Radar charts. Save as transparent PNG for presentations.",
    content: `
      <h1>Chart Maker</h1>
      <p>Create charts quickly in your browser without opening Excel. Just paste CSV formatted text data to visualize instantly.</p>

      <h2>Supported Charts</h2>
      <ul>
        <li>Includes Bar, Line, Pie, Stacked, and Histogram charts.</li>
        <li>Save as transparent PNG images to paste directly into PowerPoint or Keynote.</li>
      </ul>
    `
  },

  "/tools/calorie-checker": {
    title: "Calorie & BMI Calculator | TDEE & BMR | ToolPark.info",
    description: "Calculate BMI, BMR, and TDEE (Total Daily Energy Expenditure) based on your body metrics. Essential for scientific weight loss and muscle gain.",
    content: `
      <h1>Calorie & BMI Calculator</h1>
      <p>Successful dieting and body composition rely on numbers. Calculate your BMI (Obesity level), BMR (Basal Metabolic Rate), and TDEE (Total Daily Energy Expenditure) to support your health goals.</p>
    `
  },

  "/tools/palettegen": {
    title: "Palette Generator | Color Theory Tool | ToolPark.info",
    description: "Generate beautiful color schemes from a single base color using Color Theory algorithms. For designers, illustrators, and developers.",
    content: `
      <h1>Palette Generator</h1>
      <p>Color selection isn't just about intuition; it's about logic. This tool uses mathematical algorithms on the color wheel to generate harmonious palettes (Complementary, Triadic, Analogous) from your chosen base color.</p>
    `
  },

  // === NEW TOOLS ===

  "/tools/gantt-chart": {
    title: "Lightweight Gantt Chart | Project Timeline Maker | ToolPark.info",
    description: "Create simple Gantt charts by inputting tasks and duration. No Excel needed, export as image. Perfect for WBS and project management.",
    content: `
      <h1>Lightweight Gantt Chart</h1>
      <p>You don't need complex software to visualize a schedule. Just input task names, start dates, and duration to instantly create a clear Gantt chart.</p>

      <h2>Recommended Uses</h2>
      <ul>
        <li><strong>Project Management</strong>: Visualize timelines for small teams.</li>
        <li><strong>Study Plans</strong>: Create a roadmap for exams or certifications.</li>
        <li><strong>Event Planning</strong>: Check the schedule for weddings or events.</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li><strong>Visual WBS</strong>: See task overlaps and overall flow at a glance.</li>
        <li><strong>Image Export</strong>: Download as a PNG image to insert directly into proposals or slides.</li>
      </ul>
    `
  },
  
  "/tools/quote-formatter": {
    title: "Quote Formatter | Japanese Novel Writing Support | ToolPark.info",
    description: "Auto-formats straight quotes to Japanese brackets (「」) and handles nested quotes (『』). Essential for translating or writing Japanese novels.",
    content: `
      <h1>Quote Formatter</h1>
      <p>A tool to automate the cleanup of quotation marks, specifically useful for Japanese web novels or translations. It unifies styles and corrects nesting logic.</p>

      <h2>Conversion Logic</h2>
      <ul>
        <li><strong>Standardize Quotes</strong>: Converts standard double quotes ("") to Japanese corner brackets (「」).</li>
        <li><strong>Nesting Logic</strong>: Automatically detects nested quotes (quotes within quotes) and converts the inner brackets to double corner brackets (『』), following correct Japanese grammar rules.</li>
      </ul>
    `
  },

  "/tools/minutes-formatter": {
    title: "Minutes Formatter | Structure Meeting Notes | ToolPark.info",
    description: "Paste rough meeting notes to convert them into a structured format with Agenda, Decisions, and Todos. Improves business efficiency.",
    content: `
      <h1>Minutes Formatter</h1>
      <p>Turn your messy, bullet-pointed meeting notes into a professional, structured document instantly.</p>

      <h2>How it Works</h2>
      <p>The tool parses your text for keywords like "Decision," "Todo," or "Topic" and automatically generates headers and formatting. Once processed, you can simply copy and paste the clean text into Slack, Teams, or Email to share with your team.</p>
    `
  },

  "/tools/invoice-generator": {
    title: "Invoice Generator | Free Estimate Maker | ToolPark.info",
    description: "Simple tool for freelancers to create invoices and estimates. Input details and save as a professional image. No registration required.",
    content: `
      <h1>Invoice Generator</h1>
      <p>A convenient tool for creating invoices or estimates on the fly using your smartphone or PC. Ideal for freelancers and small business owners who want to avoid complex spreadsheet software.</p>

      <h2>Privacy & Security</h2>
      <p>This tool runs entirely in your browser. Client names and financial figures are <strong>never</strong> sent to our servers, ensuring your business data remains confidential.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Auto-Calculation</strong>: Simply input quantity and unit price; subtotal, tax, and total are calculated automatically.</li>
        <li><strong>Image Export</strong>: Save the finalized document as an image file for easy sending via email or chat.</li>
      </ul>
    `
  },

  "/tools/tier-maker": {
    title: "Tier List Maker | Ranking Chart Generator | ToolPark.info",
    description: "Create ranking charts (Tier Lists) by dragging and dropping items into S/A/B/C/D tiers. Perfect for game characters, anime, or food rankings.",
    content: `
      <h1>Tier List Maker</h1>
      <p>Create "Tier Lists" to rank anything you love. Use it for game character tier lists, favorite food rankings, or recommendation charts.</p>

      <h2>How to Use</h2>
      <ol>
        <li>Upload images or create text labels.</li>
        <li>Drag and drop items into the appropriate rows, from S-Tier (God Tier) to D-Tier.</li>
        <li>Save the completed chart as an image and share it on social media.</li>
      </ol>
    `
  }
};
