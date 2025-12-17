import { PageConfig } from './pages';

export interface PageConfig {
  title: string;
  description: string;
  content: string; // HTML format content
}

const DEFAULT_CONFIG: PageConfig = {
  title: "ToolPark.info - Smart Toolbox | Free, No-Signup & Privacy-Focused",
  description: "[No Install / No Ads] A collection of free, privacy-focused web tools. Timers, Calculators, Pixel Art Editors, Gantt Charts, and more. Works on any browser, mobile or desktop.",
  content: `
    <h1>ToolPark.info - Boost Your Productivity with Smart Tools</h1>
    <p>ToolPark.info is a platform of <strong>free, registration-free web tools</strong> designed for instant use. We believe productivity shouldn't be locked behind paywalls or tedious login processes. Whether you are on a smartphone, tablet, or desktop, simply bookmark this page to optimize your workflow immediately.</p>
    
    <h2>Why Choose ToolPark.info?</h2>
    <p>In a world full of bloated apps and subscription services, we offer a cleaner alternative:</p>
    <ul>
      <li><strong>1. No Sign-up, No Login, No Hassle</strong><br>
      You don't need to create an account or provide your email address. Just open the page and start using the tools instantly. We respect your time.</li>
      
      <li><strong>2. Privacy First (Secure & Client-Side)</strong><br>
      Your data—whether it's personal notes, financial calculations, or task lists—is processed and stored entirely within your browser (LocalStorage). Nothing is ever sent to our servers. Your secrets stay with you.</li>
      
      <li><strong>3. Lightweight & Mobile-Friendly</strong><br>
      Our tools are built as Progressive Web Apps (PWA). They load instantly even on slow connections and adapt perfectly to any screen size, from large desktop monitors to compact smartphone screens.</li>
    </ul>

    <h2>Explore Our Tools</h2>

    <h3>🕒 Time Management</h3>
    <ul>
      <li><a href="/tools/simple-timer"><strong>Simple Timer</strong></a>: A full-screen visual countdown and stopwatch. Perfect for classrooms, exams, and presentations.</li>
      <li><a href="/tools/focus-timer"><strong>Focus Timer (Pomodoro)</strong></a>: An interval timer optimized for the Pomodoro Technique and HIIT workouts.</li>
      <li><a href="/tools/log-timer"><strong>Log Timer</strong></a>: Track how much time you spend on tasks. Export data to CSV for time audits.</li>
      <li><a href="/tools/multi-timer"><strong>Multi Timer</strong></a>: Run multiple independent timers in parallel. Essential for cooking and science labs.</li>
    </ul>

    <h3>📝 Business & Productivity</h3>
    <ul>
      <li><a href="/tools/gantt-chart"><strong>Lightweight Gantt</strong></a>: Visualize project timelines and dependencies instantly without complex software.</li>
      <li><a href="/tools/invoice-generator"><strong>Invoice Generator</strong></a>: Create professional estimates and invoices in your browser. No Excel required.</li>
      <li><a href="/tools/minutes-formatter"><strong>Minutes Formatter</strong></a>: Structure rough meeting notes into a clean agenda and to-do list automatically.</li>
      <li><a href="/tools/schedule-formatter"><strong>Schedule Formatter</strong></a>: Instantly convert messy text notes into a chronological agenda.</li>
      <li><a href="/tools/habitpal"><strong>Habit Pal</strong></a>: Track daily routines and visualize your consistency streaks with a GitHub-style heat map.</li>
    </ul>

    <h3>🎨 Creative & Design</h3>
    <ul>
      <li><a href="/tools/tier-maker"><strong>Tier List Maker</strong></a>: Create ranking charts for games, anime, or community events via drag-and-drop.</li>
      <li><a href="/tools/pixel-editor"><strong>Pixel Editor</strong></a>: Create 8-bit pixel art and sprites directly in your browser. Mobile-touch friendly.</li>
      <li><a href="/tools/svg-editor"><strong>SVG Vector Editor</strong></a>: Create scalable vector graphics (SVG) with shapes and text for logos and icons.</li>
      <li><a href="/tools/palettegen"><strong>Palette Generator</strong></a>: Generate harmonious color schemes based on scientific color theory.</li>
      <li><a href="/tools/calendar-editor"><strong>Calendar Editor</strong></a>: Create custom wallpapers using your favorite photos of pets or idols.</li>
      <li><a href="/tools/chart-maker"><strong>Chart Maker</strong></a>: Generate professional bar, line, and pie charts for presentations without spreadsheet software.</li>
    </ul>

    <h3>💻 Dev & Utilities</h3>
    <ul>
      <li><a href="/tools/browser-notepad"><strong>Browser Notepad</strong></a>: An auto-saving text editor. Never lose your ideas again, even if the tab closes.</li>
      <li><a href="/tools/crypto-tool"><strong>Crypto Tool</strong></a>: Encrypt/Decrypt text with Caesar, ROT13, Base64, and Hash functions for learning.</li>
      <li><a href="/tools/encoding-converter"><strong>Encoding Converter</strong></a>: Batch convert text to URL Encode, HTML Entities, and Unicode escaping.</li>
      <li><a href="/tools/quote-formatter"><strong>Quote Formatter</strong></a>: Auto-format quotes for Japanese novel writing and translation.</li>
    </ul>

    <h3>🧮 Calculation & Simulation</h3>
    <ul>
      <li><a href="/tools/tax-threshold-checker"><strong>Tax Threshold Checker (Japan)</strong></a>: Simulate income limits (1.03M/1.3M walls) for part-time residents in Japan.</li>
      <li><a href="/tools/calorie-checker"><strong>Calorie & BMI Calculator</strong></a>: Calculate BMR and TDEE for scientific weight management and dieting.</li>
      <li><a href="/tools/romaji-converter"><strong>Romaji Converter</strong></a>: Convert Japanese Kana to Romaji (Hepburn/Kunrei) instantly.</li>
    </ul>
  `
};

export const PAGES_EN: Record<string, PageConfig> = {
  "/": DEFAULT_CONFIG,

  "/tools/simple-timer": {
    title: "Simple Timer & Stopwatch | Full Screen & Online | ToolPark.info",
    description: "Free online timer with a visual progress bar and stopwatch. Features full-screen mode, millisecond precision, and custom alarm sounds. No download required. Perfect for studying and sports.",
    content: `
      <h1>Simple Timer & Stopwatch (Online & Free)</h1>
      <p>The ToolPark.info Simple Timer is built with one goal in mind: <strong>"Visualizing Time"</strong>. It helps you manage time effectively without installing any apps. Accessible instantly from any PC, tablet, or smartphone browser.</p>
      
      <h2>Key Features & Use Cases</h2>
      <h3>1. Intuitive Visual Countdown</h3>
      <p>As the timer counts down, the background color shifts (e.g., from blue to red) and a progress bar retracts. This allows you to intuitively grasp "how much time is left" with just a quick glance, without needing to focus on the numbers.</p>
      <ul>
        <li><strong>Presentations</strong>: Keep track of your pacing while speaking without distracting the audience.</li>
        <li><strong>Exams & Study</strong>: Simulate test conditions to manage pressure and improve speed.</li>
        <li><strong>Kids & Gaming</strong>: Great for children who can't read clocks yet; the color change signals when playtime is over.</li>
      </ul>

      <h3>2. High-Precision Stopwatch</h3>
      <p>Supports measurement down to the millisecond (1/100s). It includes a <strong>Lap Time</strong> function, making it ideal for sports training, circuit training, or measuring work efficiency. You can copy your lap results directly to your clipboard.</p>

      <h3>3. Customization</h3>
      <ul>
        <li><strong>Custom Audio</strong>: Don't like the default beep? Upload your own MP3 or WAV file to use as the alarm. Wake up to your favorite song or use a gentle chime for meditation.</li>
        <li><strong>Full-Screen Mode</strong>: Remove all distractions and enlarge the clock to fill your monitor. Perfect for proctoring exams or large meeting rooms.</li>
      </ul>
    `
  },

  "/tools/focus-timer": {
    title: "Focus & Cycle Timer (Pomodoro/HIIT) | Mobile Ready | ToolPark.info",
    description: "Interval timer designed for the Pomodoro Technique and HIIT. Customizable work/break intervals and background music to maximize concentration. Free and no signup.",
    content: `
      <h1>Focus & Cycle Timer (Pomodoro / HIIT)</h1>
      <p>Human concentration is not infinite. To sustain high performance, you need structured breaks. This tool is an advanced interval timer specifically designed for alternating between <strong>Focus (Work)</strong> and <strong>Rest (Break)</strong> sessions. Use it on your phone or desktop for free.</p>

      <h2>Scientifically Proven Presets</h2>
      <p>We've included presets based on productivity science and sports physiology:</p>
      <dl>
        <dt>Pomodoro Technique (25 + 5)</dt>
        <dd>The world-famous method: 25 minutes of focus followed by a 5-minute break. Prevents burnout and keeps your brain fresh.</dd>
        
        <dt>52/17 Rule (52 + 17)</dt>
        <dd>Often cited as the "Golden Ratio" for desk work productivity. Ideal for longer deep-work sessions.</dd>
        
        <dt>Ultradian Rhythm (90 + 20)</dt>
        <dd>Matches the natural biological cycles of human energy. Best for creative tasks that require "Flow state."</dd>

        <dt>HIIT / Tabata (20s + 10s)</dt>
        <dd>High-Intensity Interval Training. 20 seconds of intense exercise followed by 10 seconds of rest. Perfect for quick home workouts.</dd>
      </dl>

      <h2>Immersive Features</h2>
      <ul>
        <li><strong>Background Ambience</strong>: Automatically switch audio environments—play "Rain Sounds" during focus time and "Lofi Beats" during breaks to trigger your brain's mode switching.</li>
        <li><strong>Visual Cues</strong>: The entire screen color changes between intervals, so you know exactly what to do without reading the text.</li>
      </ul>
    `
  },

  "/tools/log-timer": {
    title: "Log Timer (Time Tracking) | Export to CSV | ToolPark.info",
    description: "Track 'what you are doing' and 'how long'. Switch tasks with one click and export your daily timeline to CSV. Essential for freelancers and time audits.",
    content: `
      <h1>Log Timer (Time Tracking)</h1>
      <p>"Where did the day go?" If you ask yourself this, you need the Log Timer. Time is your most valuable resource, and this tool helps you perform a "Time Audit" to visualize your daily activity and improve productivity.</p>

      <h2>Who is this for?</h2>
      <ul>
        <li><strong>Freelancers</strong>: Accurately track billable hours for different clients to generate invoices.</li>
        <li><strong>Students</strong>: Log study hours for different subjects to ensure balanced learning.</li>
        <li><strong>Self-Improvers</strong>: Identify how much time you waste on social media or distractions.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li><strong>One-Click Switching</strong>: Just click buttons like "Work," "Meeting," or "Break." It automatically stops the previous timer and starts the new one. This prevents time gaps and ensures accurate data.</li>
        <li><strong>CSV Export</strong>: Download your daily log as a CSV file. You can import this into Excel or Google Sheets to create pivot tables, graphs, or attach it to your invoices. Data is stored locally, so your privacy is protected.</li>
      </ul>
    `
  },

  "/tools/multi-timer": {
    title: "Multi Timer | Manage Multiple Countdowns Parallel | ToolPark.info",
    description: "Run multiple timers simultaneously in your browser. Name each timer individually. Perfect for complex cooking, lab experiments, and multitasking.",
    content: `
      <h1>Multi Timer (Parallel Countdown)</h1>
      <p>A standard phone timer can usually only run one countdown at a time. The Multi Timer lets you run and manage multiple independent timers on a single screen. It provides powerful support for multitasking scenarios where parallel processing is required.</p>

      <h2>Use Cases</h2>
      <h3>🍳 Cooking & Kitchen</h3>
      <p>Manage complex meals like a pro chef. Keep track of everything simultaneously:</p>
      <ul>
        <li>Timer 1: "Boil Pasta" (8 min)</li>
        <li>Timer 2: "Simmer Sauce" (20 min)</li>
        <li>Timer 3: "Roast Chicken" (45 min)</li>
      </ul>

      <h3>⚗️ Science & Laboratory</h3>
      <p>Perfect for experiments requiring multiple reaction times. Since it runs in the browser, you can display it on a large monitor for the whole lab team to see.</p>

      <h3>💻 Time Boxing</h3>
      <p>Gamify your work by setting limits for multiple tasks. "10 mins for email," "45 mins for the report," and "15 mins for break." Racing against the clock can significantly boost focus.</p>
    `
  },

  "/tools/habitpal": {
    title: "Habit Pal | Habit Tracker & Streak Manager | ToolPark.info",
    description: "Build new habits with the 'Don't Break the Chain' method. Visualize progress with a heatmap calendar. Privacy-focused and login-free.",
    content: `
      <h1>Habit Pal (Habit Tracker)</h1>
      <p>It is said that it takes at least 66 days to form a new habit. Habit Pal is your partner in recording small daily wins and maintaining motivation. It is based on the "Don't Break the Chain" method popularized by comedian Jerry Seinfeld.</p>

      <h2>Why it Works</h2>
      <ul>
        <li><strong>Streak Calculation</strong>: The tool prominently displays your current streak. This leverages the psychological principle of "Loss Aversion"—you won't want to break the chain you've worked so hard to build.</li>
        <li><strong>Heatmap Calendar</strong>: Visualize your effort over time with a GitHub-style contribution graph. Seeing your calendar fill up with color provides a sense of accomplishment and visual proof of your discipline.</li>
        <li><strong>Privacy First</strong>: Your goals and habits are personal. Unlike cloud apps, your data is stored locally in your browser. No one else can see it, and no login is required.</li>
      </ul>
    `
  },

  "/tools/browser-notepad": {
    title: "Browser Notepad | Auto-Save & Character Count | ToolPark.info",
    description: "Instant online text editor. Content is auto-saved to your browser. Features character/line counter and file download. No cloud login needed.",
    content: `
      <h1>Browser Notepad (Auto-Save Editor)</h1>
      <p>"I need to jot something down quickly, but I don't want to wait for Word to load." This tool is the answer. A lightweight browser-based text editor that opens instantly and saves your work automatically.</p>

      <h2>Peace of Mind: Auto-Save</h2>
      <p>Every character you type is instantly saved to your browser's Local Storage. You don't need to press a save button. Even if you accidentally close the tab or your browser crashes, your text will be there when you come back.</p>

      <h2>Writing Aids</h2>
      <ul>
        <li><strong>Real-time Counters</strong>: Displays character (with/without spaces) and line counts. Essential for drafting tweets, essays, or reports with strict length limits.</li>
        <li><strong>Timestamp</strong>: Insert the current date and time with one click. Great for maintaining a daily log or meeting minutes.</li>
        <li><strong>Local Export</strong>: Save your text as a standard `.txt` file to your device for backup or sharing.</li>
      </ul>
    `
  },

  "/tools/pixel-editor": {
    title: "Pixel Editor | Free Online Pixel Art Maker | ToolPark.info",
    description: "Create pixel art and sprites in your browser. Supports mobile touch and mouse. Export to transparent PNG. Canvas sizes from 16x16 to 64x64.",
    content: `
      <h1>Pixel Editor</h1>
      <p>Create retro-style "Pixel Art" right in your browser. No expensive graphic software or app installation is needed. The interface is optimized for both PC mouse precision and smartphone touch control.</p>

      <h2>Powerful Features</h2>
      <p>Despite being free, it packs essential tools for serious artists:</p>
      <ul>
        <li><strong>Tools</strong>: Pen, Eraser, Bucket Fill, and Color Picker (Eyedropper).</li>
        <li><strong>Custom Palette</strong>: Use standard colors or mix your own using the full RGB spectrum.</li>
        <li><strong>Layer-like History</strong>: Includes Undo/Redo functions so you can experiment without fear of making mistakes.</li>
      </ul>

      <h2>Choose Your Canvas</h2>
      <ul>
        <li><strong>16x16 / 32x32</strong>: Ideal for retro game sprites, favicons, or simple icons.</li>
        <li><strong>48x48 / 64x64</strong>: Better for detailed avatars, NFT art, or assets for modern indie games.</li>
      </ul>
      <p>Export your work as a transparent PNG file, ready to be used in game engines like Unity or as social media profile pictures.</p>
    `
  },

  "/tools/svg-editor": {
    title: "SVG Vector Editor | Create Scalable Graphics | ToolPark.info",
    description: "Browser-based vector graphics editor. Create shapes, text, and designs that don't lose quality when resized. Save as SVG file.",
    content: `
      <h1>SVG Vector Editor</h1>
      <p>A simple yet capable vector drawing tool that allows you to create graphics without installing heavy software like Illustrator. Created images are saved as SVG files, which are perfect for modern web design, logos, and icons.</p>

      <h2>Why SVG (Vector)?</h2>
      <p>Unlike standard images (JPG/PNG), Vector graphics have distinct advantages:</p>
      <ul>
        <li><strong>Infinite Scalability</strong>: Vectors are defined by math, not pixels. You can zoom in infinitely or resize them to billboard size without any loss of quality or blurriness.</li>
        <li><strong>Lightweight</strong>: SVG files are text-based code, making them significantly smaller in file size than photos. This improves website loading speed and SEO.</li>
      </ul>
      
      <h2>Core Functions</h2>
      <p>Place rectangles, circles, text, and paths on the canvas. You can adjust colors, stroke width, and opacity freely. It's the quickest way to create a simple diagram or logo directly in your browser.</p>
    `
  },

  "/tools/calendar-editor": {
    title: "Calendar Editor | Custom Wallpaper Maker | ToolPark.info",
    description: "Create and download custom monthly calendars with your favorite background images. Perfect for smartphone lock screens and printable desk calendars.",
    content: `
      <h1>Calendar Editor</h1>
      <p>A DIY generator that lets you create original calendar images by uploading your own photos. Combine the functionality of a calendar with photos of your "Faves" (Idols), beloved pets, or beautiful travel memories.</p>

      <h2>Creative Use Cases</h2>
      <ul>
        <li><strong>Lock Screen Wallpaper</strong>: Embed this month's calendar into your phone wallpaper. You can check the date instantly every time you wake your phone.</li>
        <li><strong>DIY Printables</strong>: Download the high-quality image and print it at home or a kiosk. Frame it to create a unique desk calendar—a perfect personalized gift.</li>
        <li><strong>Fandom Activities</strong>: Create calendars featuring your favorite character's birthday month and share them with your community.</li>
      </ul>
    `
  },

  "/tools/crypto-tool": {
    title: "Crypto Tool | Caesar, Base64, ROT13 | ToolPark.info",
    description: "Encrypt and decrypt text using various methods. Great for learning cybersecurity basics, CTF challenges, or secret messages. No server upload.",
    content: `
      <h1>Crypto Tool</h1>
      <p>A learning tool to easily encrypt (encode) and decrypt (decode) text messages using various algorithms. It's useful for CTF (Capture The Flag) practice, programming study, or just having fun sending secret messages to friends. All processing happens locally in your browser.</p>

      <h2>Supported Algorithms</h2>
      <ul>
        <li><strong>Caesar Cipher</strong>: A classic cipher that shifts alphabets by a set number (e.g., A -> C). Great for understanding the history of encryption.</li>
        <li><strong>ROT13</strong>: A special case of Caesar cipher that shifts letters by 13. Often used in online forums to hide spoilers.</li>
        <li><strong>Base64</strong>: A method to encode binary data into text. Widely used in email attachments and data URIs.</li>
        <li><strong>Hashing (MD5/SHA)</strong>: One-way encryption. Useful for verifying file integrity or understanding how passwords are stored securely.</li>
      </ul>
    `
  },

  "/tools/encoding-converter": {
    title: "Encoding Converter | URL Encode & HTML Entities | ToolPark.info",
    description: "Batch convert text to various formats like URL Encode, HTML Entities, Unicode Escape. Essential for web developers and debugging.",
    content: `
      <h1>Encoding Converter</h1>
      <p>A developer utility to convert text formats instantly. "Why is this character showing up as garbage?" "How do I put spaces in a URL?" This tool solves these common tech headaches.</p>

      <h2>Main Conversion Formats</h2>
      <ul>
        <li><strong>URL Encode (Percent-encoding)</strong>: Safely encode special characters for use in URLs (e.g., converting " " to "%20"). Essential for API testing.</li>
        <li><strong>HTML Entities</strong>: Convert special chars like &lt; and &amp; so they display correctly as text on a webpage instead of being interpreted as code.</li>
        <li><strong>Unicode Escape</strong>: Convert text to the \\uXXXX format used in Java, JavaScript, and Python. Useful for debugging internationalization (i18n) issues.</li>
      </ul>
    `
  },

  "/tools/tax-threshold-checker": {
    title: "Tax Threshold Checker (Japan) | Income Wall Simulation | ToolPark.info",
    description: "For residents in Japan. Calculate remaining income allowance for the 1.03 million yen (Tax) and 1.30 million yen (Social Insurance) walls.",
    content: `
      <h1>Tax Threshold Checker (Japan Income Walls)</h1>
      <p><em>*This tool is designed for residents and part-time workers in Japan.</em></p>
      <p>In Japan, the "Annual Income Walls" are a critical concern for part-timers and students. Earning too much can result in sudden tax liabilities or the loss of social insurance dependency status, effectively reducing your net income. This tool simulates these rules to help you plan your shifts.</p>

      <h2>Understanding the "Walls"</h2>
      <dl>
        <dt>1.03 Million Yen Wall (Income Tax)</dt>
        <dd>If you exceed this, you must pay income tax. More importantly, your supporter (parent/spouse) may lose their "Dependent Deduction," increasing their taxes.</dd>

        <dt>1.30 Million Yen Wall (Social Insurance)</dt>
        <dd>The most critical threshold. Exceeding this removes you from your family's health insurance and pension. You will have to pay for your own National Health Insurance and Pension, which can cost ~150,000 to 300,000 JPY per year.</dd>
      </dl>

      <h2>How to Use</h2>
      <p>Input your current cumulative income and estimated monthly earnings. The tool will calculate "How much more you can earn" before hitting these walls.</p>
    `
  },

  "/tools/schedule-formatter": {
    title: "Schedule Formatter | Organize Messy Notes | ToolPark.info",
    description: "Convert rough text notes like '10am Meeting' into a sorted, beautiful agenda. Auto-calculates duration and free time. No AI needed, just smart logic.",
    content: `
      <h1>Schedule Formatter</h1>
      <p>Dump your brain's rough schedule into the text box, and our algorithm will organize it instantly. Perfect for sorting out your day before entering it into a formal calendar like Google Calendar.</p>

      <h2>Solve These Problems</h2>
      <ul>
        <li>"I wrote my tasks down, but the times are all over the place." -> <strong>Auto-Sort</strong> fixes this.</li>
        <li>"I don't know how many minutes are between 13:00 and 14:45." -> <strong>Duration Calculator</strong> does the math.</li>
        <li>"Where do I have free time?" -> <strong>Gap Visualization</strong> shows you immediately.</li>
      </ul>

      <h2>Export & Share</h2>
      <p>The formatter not only organizes the text but can also export the schedule as a clean image. This is perfect for sharing your daily agenda with a team via Slack/Discord or posting your event schedule on social media.</p>
    `
  },

  "/tools/romaji-converter": {
    title: "Romaji Converter Pro | Hepburn & Kunrei | ToolPark.info",
    description: "Convert Japanese Kana to Romaji instantly. Supports Passport style (Hepburn) and School style (Kunrei). Includes reverse conversion.",
    content: `
      <h1>Romaji Converter Pro</h1>
      <p>A professional tool to convert Japanese scripts (Hiragana/Katakana) into Romaji (Latin script). This is essential for filling out international forms, creating business cards, or data entry.</p>

      <h2>Hepburn vs. Kunrei Systems</h2>
      <p>Using the correct system for your purpose is crucial:</p>
      <ul>
        <li><strong>Hepburn Style (Passport Standard)</strong>: Designed to match English pronunciation (e.g., "SHI", "TSU", "FU"). This is the standard for <strong>Passports, Road Signs, and Credit Cards</strong>.</li>
        <li><strong>Kunrei Style (Academic)</strong>: Follows the logic of the Japanese Kana chart (e.g., "SI", "TU", "HU"). Used in Japanese elementary schools and some ISO standards.</li>
      </ul>

      <h2>Reverse Conversion</h2>
      <p>Also supports "Romaji to Kana" conversion. Useful if you have a dataset of names in English and need to restore them to Japanese, or for practicing your typing.</p>
    `
  },

  "/tools/chart-maker": {
    title: "Chart Maker | Create Graphs Online Free | ToolPark.info",
    description: "No Excel needed. Paste data to generate professional Bar, Line, Pie, and Radar charts. Save as transparent PNG for presentations.",
    content: `
      <h1>Chart Maker</h1>
      <p>"I need a graph for my slide, but opening Excel takes too long." This browser-based tool is the solution. Generate professional-looking charts instantly by simply typing or pasting data.</p>

      <h2>3 Simple Steps</h2>
      <ol>
        <li><strong>Input Data</strong>: Enter labels and numbers manually, or paste CSV data directly from a spreadsheet.</li>
        <li><strong>Customize</strong>: Choose your chart type (Bar, Line, Pie, Radar, etc.) and adjust colors/titles in real-time.</li>
        <li><strong>Download</strong>: Save as a transparent PNG image. It's ready to be pasted into PowerPoint, Google Slides, or Word docs.</li>
      </ol>

      <h2>Supported Chart Types</h2>
      <ul>
        <li><strong>Bar / Column</strong>: Best for comparing values (e.g., Sales by Region).</li>
        <li><strong>Line</strong>: Best for trends over time (e.g., Stock prices, Weight loss).</li>
        <li><strong>Pie / Doughnut</strong>: Best for showing part-to-whole composition (e.g., Budget allocation).</li>
        <li><strong>Radar</strong>: Great for comparing multiple attributes (e.g., Character stats, Skill assessment).</li>
      </ul>
    `
  },

  "/tools/calorie-checker": {
    title: "Calorie & BMI Calculator | TDEE & BMR | ToolPark.info",
    description: "Calculate BMI, BMR, and TDEE (Total Daily Energy Expenditure) based on your body metrics. Essential for scientific weight loss and muscle gain.",
    content: `
      <h1>Calorie & BMI Calculator</h1>
      <p>Successful dieting and body composition rely on numbers, not guesses. Don't just starve yourself; use a scientific approach to reach your ideal body. This tool calculates your vital health metrics instantly without registration.</p>

      <h2>What you will learn</h2>
      <h3>1. BMI (Body Mass Index)</h3>
      <p>An international standard to check obesity levels. We calculate where you stand (Underweight, Normal, Overweight) based on WHO guidelines and suggest an "Ideal Weight."</p>

      <h3>2. BMR (Basal Metabolic Rate)</h3>
      <p>The calories your body burns just to stay alive (breathing, organ function). Eating less than this amount can actually harm your metabolism and lead to muscle loss.</p>

      <h3>3. TDEE (Total Daily Energy Expenditure)</h3>
      <p>Your actual daily calorie burn, including your activity level (desk job vs. athlete).</p>
      <ul>
        <li><strong>To Lose Weight</strong>: Eat less than your TDEE.</li>
        <li><strong>To Gain Muscle</strong>: Eat more than your TDEE.</li>
      </ul>
      <p>Knowing this number is the first step to controlling your weight.</p>
    `
  },

  "/tools/palettegen": {
    title: "Palette Generator | Color Theory Tool | ToolPark.info",
    description: "Generate beautiful color schemes from a single base color using Color Theory algorithms. For designers, illustrators, and developers.",
    content: `
      <h1>Palette Generator (Color Theory)</h1>
      <p>Color selection isn't just about intuition/sense; it's about logic. Picking colors randomly often leads to messy designs. This tool uses mathematical algorithms on the color wheel to generate harmonious palettes from a single base color.</p>

      <h2>Palette Types</h2>
      <dl>
        <dt>Monochromatic</dt>
        <dd>Variations in lightness and saturation of a single color. Clean, professional, and easy on the eyes.</dd>
        
        <dt>Analogous</dt>
        <dd>Colors that sit next to each other on the color wheel (e.g., Blue and Teal). Found often in nature, they create a serene and comfortable design.</dd>
        
        <dt>Complementary</dt>
        <dd>Colors opposite each other on the wheel (e.g., Blue and Orange). High contrast and high impact. Great for Call-to-Action buttons.</dd>
      </dl>

      <p>Copy the HEX codes with one click and paste them into CSS, Photoshop, or Figma.</p>
    `
  },

  "/tools/gantt-chart": {
    title: "Lightweight Gantt Chart | Project Timeline Maker | ToolPark.info",
    description: "Create simple Gantt charts by inputting tasks and duration. No Excel needed, export as image. Perfect for WBS and project management.",
    content: `
      <h1>Lightweight Gantt Chart</h1>
      <p>Visualizing a schedule is key to project success, but professional software is expensive and complex. This tool allows you to create a clear Gantt chart (Project Timeline) instantly by just typing tasks and dates. No login required.</p>

      <h2>Recommended Uses</h2>
      <ul>
        <li><strong>Project Management</strong>: Visualize "Who" does "What" and "When" for small teams.</li>
        <li><strong>Study Roadmap</strong>: Plan backward from your exam date to ensure you cover all subjects.</li>
        <li><strong>Event Planning</strong>: Coordinate vendors, venue prep, and invitations for weddings or parties.</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li><strong>Visual WBS</strong>: See task overlaps and the critical path at a glance. Helps identify impossible deadlines early.</li>
        <li><strong>Image Export</strong>: Download your chart as a PNG image. Paste it directly into your project proposal or weekly report to impress your boss or client.</li>
      </ul>
    `
  },
  
  "/tools/quote-formatter": {
    title: "Quote Formatter | Japanese Novel Writing Support | ToolPark.info",
    description: "Auto-formats straight quotes to Japanese brackets (「」) and handles nested quotes (『』). Essential for translating or writing Japanese novels.",
    content: `
      <h1>Quote Formatter</h1>
      <p><em>*This tool is specialized for Japanese text formatting.</em></p>
      <p>For writers and translators of Japanese web novels, formatting dialogue can be tedious. Mixing half-width quotes ("") with full-width Japanese text looks unprofessional. This tool automates the cleanup process.</p>

      <h2>What it does</h2>
      <ul>
        <li><strong>Standardize Quotes</strong>: Converts standard double quotes ("") to Japanese corner brackets (「」).</li>
        <li><strong>Smart Nesting Logic</strong>: If you have a quote within a quote (e.g., a character reading a letter aloud), the tool detects it and converts the inner brackets to double corner brackets (『』), adhering to proper Japanese grammar rules.</li>
      </ul>
    `
  },

  "/tools/minutes-formatter": {
    title: "Minutes Formatter | Structure Meeting Notes | ToolPark.info",
    description: "Paste rough meeting notes to convert them into a structured format with Agenda, Decisions, and Todos. Improves business efficiency.",
    content: `
      <h1>Minutes Formatter</h1>
      <p>Are you spending too much time polishing meeting minutes? This tool instantly converts your rough, chronological notes into a structured, professional document. Focus on the discussion, not the formatting.</p>

      <h2>How it Works</h2>
      <p>Simply paste your raw text notes (bullet points) into the tool. Our logic analyzes keywords like "Decision," "Todo," or "Topic" and automatically organizes them into headers.</p>
      <p>Once processed, copy the result into Slack, Microsoft Teams, or Email. You can share clear, actionable minutes seconds after the meeting ends.</p>
    `
  },

  "/tools/invoice-generator": {
    title: "Invoice Generator | Free Estimate Maker | ToolPark.info",
    description: "Simple tool for freelancers to create invoices and estimates. Input details and save as a professional image. No registration required.",
    content: `
      <h1>Invoice Generator</h1>
      <p>A convenient tool for creating invoices or estimates on the fly. Ideal for freelancers, contractors, and small business owners who want to avoid the hassle of opening Excel or paying for cloud accounting software.</p>

      <h2>Privacy & Security</h2>
      <p>Invoices contain sensitive client data and financial figures. Unlike cloud services, <strong>this tool runs entirely in your browser</strong>. Your data is never sent to our servers, ensuring absolute confidentiality.</p>

      <h2>Smart Features</h2>
      <ul>
        <li><strong>Auto-Calculation</strong>: Simply input quantity and unit price; the tool automatically calculates subtotals, tax (customizable rate), and grand totals. Eliminates math errors.</li>
        <li><strong>Image Export</strong>: Save the finalized document as a clean image file. You can attach it to an email or send it via messaging apps immediately.</li>
      </ul>
    `
  },

  "/tools/tier-maker": {
    title: "Tier List Maker | Ranking Chart Generator | ToolPark.info",
    description: "Create ranking charts (Tier Lists) by dragging and dropping items into S/A/B/C/D tiers. Perfect for game characters, anime, or food rankings.",
    content: `
      <h1>Tier List Maker</h1>
      <p>Create "Tier Lists" to rank anything you love. Whether it's the strongest characters in a fighting game, the best snacks, or your favorite anime of the season, this tool makes it easy to visualize your opinions.</p>

      <h2>What is a Tier List?</h2>
      <p>A culture born from gaming communities, where "S-Tier" represents the absolute best (God Tier), followed by A, B, C, and D. It's now a universal format for sharing rankings on social media.</p>

      <h2>How to Use</h2>
      <ol>
        <li>Upload images from your device or create text labels.</li>
        <li>Drag and drop items into the appropriate rows. You can customize the row colors and names (e.g., change "S" to "Godlike").</li>
        <li>Save the completed chart as an image and share it on Twitter/X, Discord, or Reddit to start a debate!</li>
      </ol>
    `
  }
};
