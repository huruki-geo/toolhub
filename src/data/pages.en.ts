import { PageConfig } from './pages';

const DEFAULT_CONFIG: PageConfig = {
  title: "Quikit.info - Smart Toolbox | Free & No-Signup Web Tools",
  description: "[No Install / No Ads] A collection of privacy-focused web tools like Timers, Calculators, Pixel Art Editors, and more. Data stays in your browser.",
  content: `
    <h1>Quikit.info - Boost Your Productivity with Smart Tools</h1>
    <p>Quikit.info is a platform of <strong>free, registration-free web tools</strong> designed for instant use. No app downloads or tedious login processes required. Just bookmark and start optimizing your workflow immediately.</p>
    
    <h2>Why Choose Quikit.info?</h2>
    <ul>
      <li><strong>Privacy First (Secure)</strong>: Your data (notes, tasks, personal metrics) is processed and stored entirely within your browser (LocalStorage). Nothing is sent to our servers, ensuring your privacy.</li>
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

    <h3>📝 Productivity & Habits</h3>
    <ul>
      <li><strong>Habit Pal</strong>: Track daily routines and visualize your streaks with a heat map.</li>
      <li><strong>Schedule Formatter</strong>: Instantly convert messy text notes into a chronological agenda.</li>
      <li><strong>Browser Notepad</strong>: Auto-saving text editor. Never lose your ideas again.</li>
    </ul>

    <h3>🎨 Creative & Design</h3>
    <ul>
      <li><strong>Pixel Editor</strong>: Create 8-bit pixel art and sprites directly in your browser.</li>
      <li><strong>Palette Generator</strong>: Generate harmonious color schemes based on color theory.</li>
      <li><strong>Chart Maker</strong>: Create professional charts for presentations without Excel.</li>
    </ul>

    <h3>🧮 Calculation & Utilities</h3>
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
    title: "Simple Timer & Stopwatch | Full Screen & Custom Audio - Quikit.info",
    description: "Free online timer with visual progress bar and stopwatch. Features full-screen mode, millisecond precision, and custom alarm sounds. Perfect for studying, cooking, and sports.",
    content: `
      <h1>Simple Timer & Stopwatch</h1>
      <p>The Quikit.info Simple Timer focuses on <strong>"Time Visualization"</strong>. It helps you manage time effectively without installing any apps. Accessible instantly from any PC or smartphone browser.</p>
      
      <h2>Key Features & Use Cases</h2>
      <h3>1. Visual Countdown Timer</h3>
      <p>The background color changes and a progress bar advances as time counts down. You can intuitively grasp "how much time is left" without staring at the numbers.</p>
      <ul>
        <li><strong>Presentations</strong>: Manage your pacing with a quick glance.</li>
        <li><strong>Exam Prep</strong>: Simulate time pressure for solving past exam papers.</li>
        <li><strong>Kids' Screen Time</strong>: Visual cues make it easier for children to understand time limits.</li>
      </ul>

      <h3>2. High-Precision Stopwatch</h3>
      <p>Supports measurement down to the millisecond (1/100s). Includes a <strong>Lap Time</strong> function, making it ideal for sports training or measuring work speed.</p>

      <h3>3. Customizable Experience</h3>
      <ul>
        <li><strong>Custom Alarm Sound</strong>: Upload your own audio file (mp3/wav) to use as the alarm. Wake up or stop working to your favorite song.</li>
        <li><strong>Large Screen Mode</strong>: Removes UI clutter to maximize the clock display. Visible from the back of a classroom or conference room.</li>
      </ul>
    `
  },

  "/tools/focus-timer": {
    title: "Focus & Cycle Timer (Pomodoro/HIIT) | Productivity Tool - Quikit.info",
    description: "Interval timer designed for the Pomodoro Technique (25+5) and HIIT. Customizable work/break intervals and background music to maximize concentration.",
    content: `
      <h1>Focus & Cycle Timer (Pomodoro/HIIT)</h1>
      <p>Human concentration is limited. Appropriate breaks are the key to sustained performance. This tool is an advanced interval timer specifically designed for alternating between <strong>Focus (Work)</strong> and <strong>Rest (Break)</strong>.</p>

      <h2>Scientifically Proven Presets</h2>
      <p>We've included templates based on brain science and sports science productivity methods:</p>
      <dl>
        <dt>Pomodoro Technique (25min + 5min)</dt>
        <dd>A world-famous method. Short bursts of focus followed by short breaks help complete tasks efficiently.</dd>
        
        <dt>52/17 Rule (52min + 17min)</dt>
        <dd>The "Golden Ratio" of productivity for desk work. Prevents burnout during long working hours.</dd>
        
        <dt>Ultradian Rhythm (90min + 20min)</dt>
        <dd>Based on the body's natural biological clock. Ideal for deep creative work.</dd>
        
        <dt>HIIT / Tabata (20sec + 10sec)</dt>
        <dd>High-Intensity Interval Training. 8 sets of intense exercise to boost cardiopulmonary function and fat burning.</dd>
      </dl>

      <h2>Feature Highlights</h2>
      <ul>
        <li><strong>Ambient BGM</strong>: Set different sounds for work (e.g., Rain noise) and break (e.g., Jazz). Audio cues help switch your brain's mode.</li>
        <li><strong>Visual Guide</strong>: The entire screen changes color to indicate whether you should be working or resting.</li>
      </ul>
    `
  },

  "/tools/log-timer": {
    title: "Log Timer (Time Tracking) | Export to CSV - Quikit.info",
    description: "Track 'what you are doing' and 'how long'. Switch tasks with one click and export your daily timeline to CSV. Essential for freelancers and time audits.",
    content: `
      <h1>Log Timer (Time Tracking Tool)</h1>
      <p>Time is your most valuable resource. The Log Timer allows you to visualize how you spend your day and perform a "Time Audit" to improve productivity.</p>

      <h2>Recommended For</h2>
      <ul>
        <li><strong>Freelancers & Remote Workers</strong>: Accurately track billable hours for clients and invoices.</li>
        <li><strong>Students</strong>: Record study time per subject to manage your learning progress.</li>
        <li><strong>Self-Improvement</strong>: Identify time-wasting habits (like doom-scrolling) and optimize your routine.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Seamless Switching</strong>: Just click buttons like "Work," "Meeting," or "Break." It automatically stops the previous timer and starts the new one. No gaps in your records.</li>
        <li><strong>CSV Export</strong>: Download your data as a CSV file. Import it into Excel or Google Sheets to create graphs and analyze your monthly performance.</li>
        <li><strong>Custom Tags</strong>: Create your own project names or task categories to fit your lifestyle.</li>
      </ul>
    `
  },

  "/tools/multi-timer": {
    title: "Multi Timer | Manage Multiple Countdowns Parallel - Quikit.info",
    description: "Run multiple timers simultaneously in your browser. Name each timer individually. Perfect for complex cooking, lab experiments, and multitasking.",
    content: `
      <h1>Multi Timer (Parallel Countdown)</h1>
      <p>A tool that lets you run and manage multiple independent timers on a single screen. Powerful support for multitasking where parallel processing is required.</p>

      <h2>Usage Examples</h2>
      <h3>🍳 Cooking (Professional Kitchen Timer)</h3>
      <p>Manage multiple dishes simultaneously, just like a pro chef.</p>
      <ul>
        <li>Timer 1: "Boil Pasta" (8 min)</li>
        <li>Timer 2: "Simmer Sauce" (20 min)</li>
        <li>Timer 3: "Dough Proofing" (60 min)</li>
      </ul>

      <h3>⚗️ Science & Research</h3>
      <p>Useful in labs for measuring reaction times of multiple samples simultaneously. Works as a free alternative to expensive multi-channel timers.</p>

      <h3>💻 Time Boxing</h3>
      <p>Set limits for multiple tasks: "10 mins for email," "45 mins for report." Turn your todo list into a game against the clock.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Unlimited Timers</strong>: Add as many as you need.</li>
        <li><strong>Labeling</strong>: Name each timer so you never confuse which alarm is ringing.</li>
        <li><strong>Individual Control</strong>: Start, stop, and reset timers individually or all at once.</li>
      </ul>
    `
  },

  "/tools/habitpal": {
    title: "Habit Pal | Habit Tracker & Streak Manager - Quikit.info",
    description: "Build new habits with the 'Don't Break the Chain' method. Visualize progress with a heatmap calendar. Privacy-focused and login-free.",
    content: `
      <h1>Habit Pal (Habit Tracker)</h1>
      <p>It takes time to build a new habit. Habit Pal is your partner in recording small daily wins and maintaining motivation. Practice Jerry Seinfeld's "Don't Break the Chain" method directly in your browser.</p>

      <h2>Why it Works</h2>
      <ul>
        <li><strong>Streak Calculation</strong>: Seeing your continuous streak count leverages the psychological principle of "Loss Aversion"—you won't want to break the chain.</li>
        <li><strong>Heatmap Calendar</strong>: View your consistency over time with a GitHub-style contribution graph. Visualizing your effort builds confidence.</li>
        <li><strong>Hybrid Task Management</strong>: Manage recurring "Habits" and one-off "To-Do" tasks in a single view.</li>
        <li><strong>100% Private</strong>: Your data lives in your browser. No accounts, no cloud, no tracking.</li>
      </ul>

      <h2>Habit Ideas</h2>
      <ul>
        <li><strong>Health</strong>: Drink 2L water, Sleep 7 hours, Take vitamins.</li>
        <li><strong>Learning</strong>: Read 15 mins, Learn 5 new words.</li>
        <li><strong>Fitness</strong>: 30 Squats, Morning walk.</li>
      </ul>
    `
  },

  "/tools/browser-notepad": {
    title: "Browser Notepad | Auto-Save & Character Count - Quikit.info",
    description: "Instant online text editor. Content is auto-saved to your browser. Features character/line counter and file download. No cloud login needed.",
    content: `
      <h1>Browser Notepad</h1>
      <p>"I need to jot something down quickly." This tool is the answer. A lightweight browser-based text editor with zero loading time.</p>

      <h2>Reliable Auto-Save</h2>
      <p>Every character you type is instantly saved to your browser's Local Storage. You don't need to press a save button. Even if you accidentally close the tab or your browser crashes, your text will be there when you return.</p>

      <h2>Writing Aids</h2>
      <ul>
        <li><strong>Real-time Counters</strong>: Displays character count (with/without spaces) and line count. Essential for drafting tweets, essays, or reports with length limits.</li>
        <li><strong>Timestamp</strong>: Insert current date and time with one click. Great for meeting minutes or journals.</li>
        <li><strong>File Export</strong>: Download your notes as a standard <code>.txt</code> file to your device for long-term storage.</li>
      </ul>
    `
  },

  "/tools/pixel-editor": {
    title: "Pixel Editor | Free Online Pixel Art Maker - Quikit.info",
    description: "Create pixel art and sprites in your browser. Supports mobile touch and mouse. Export to transparent PNG. Canvas sizes from 16x16 to 64x64.",
    content: `
      <h1>Pixel Editor (8-bit Art Maker)</h1>
      <p>Create retro-style "Pixel Art" right in your browser. No expensive graphic software needed. Designed to be easy to use on both PC mouse and smartphone touch screens.</p>

      <h2>Rich Editing Tools</h2>
      <p>Simple interface, powerful features:</p>
      <ul>
        <li><strong>Basic Tools</strong>: Pen, Eraser, Bucket Fill, Eye Dropper.</li>
        <li><strong>Shapes</strong>: Draw Lines, Rectangles, and Circles instantly.</li>
        <li><strong>Color Palette</strong>: Use presets or create custom colors from 16.7 million options using the picker.</li>
        <li><strong>Layer-like Feel</strong>: Undo/Redo history allows you to experiment without fear of mistakes.</li>
      </ul>

      <h2>Canvas Sizes for Every Need</h2>
      <ul>
        <li><strong>16x16 / 32x32</strong>: For retro game sprites, icons, and favicons.</li>
        <li><strong>48x48 / 64x64</strong>: For detailed items, NFT art, and avatars.</li>
      </ul>
      
      <p>Export your masterpiece as a high-quality transparent PNG, ready for game development or social media.</p>
    `
  },

  "/tools/tax-threshold-checker": {
    title: "Tax Threshold Checker (Japan) | Income Wall Simulation - Quikit.info",
    description: "For residents in Japan. Calculate remaining income allowance for the 1.03 million yen (Tax) and 1.30 million yen (Social Insurance) walls.",
    content: `
      <h1>Tax Threshold Checker (Japan Income Barriers)</h1>
      <p>For part-time workers in Japan, the "Annual Income Walls" are a critical concern. Earning too much can result in taxes or loss of dependency status, reducing your net take-home pay. This tool simulates these complex rules.</p>

      <h2>Understanding the "Walls"</h2>
      <dl>
        <dt>1.03 Million Yen Wall (Income Tax)</dt>
        <dd>If you exceed this, you must pay income tax. You also lose the status for the "Spousal Deduction" for your partner.</dd>

        <dt>1.06 Million Yen Wall (Social Insurance - Large Companies)</dt>
        <dd>For employees at larger companies, exceeding ~1.06M/year triggers mandatory Social Insurance enrollment, deducting premiums from your salary.</dd>

        <dt>1.30 Million Yen Wall (Social Insurance - All)</dt>
        <dd>The most critical wall. Exceeding this removes you from your family's dependency (Fuyo). You must pay your own Health Insurance and Pension, which can significantly drop your net income.</dd>
      </dl>

      <h2>How to Use</h2>
      <p>Input your current cumulative income and expected future monthly income. The tool instantly calculates "How much more you can earn" before hitting these walls.</p>
    `
  },

  "/tools/schedule-formatter": {
    title: "Schedule Formatter | Organize Messy Notes - Quikit.info",
    description: "Convert rough text notes like '10am Meeting' into a sorted, beautiful agenda. Auto-calculates duration and free time.",
    content: `
      <h1>Schedule Formatter</h1>
      <p>Dump your brain's rough schedule into the text box, and our algorithm will organize it instantly. Perfect for sorting out your day before entering it into a formal calendar.</p>

      <h2>Solve These Problems</h2>
      <ul>
        <li>"I wrote down tasks in random order, and I can't see the flow."</li>
        <li>"Calculating how many minutes are between 13:00 and 14:45 is a hassle."</li>
        <li>"I need a clean agenda text to share with my team."</li>
      </ul>

      <h2>Smart Features</h2>
      <ul>
        <li><strong>Auto-Sort</strong>: Inputs like "18:00 Dinner" and "09:00 Meeting" are automatically sorted chronologically.</li>
        <li><strong>Duration Calc</strong>: Automatically calculates time gaps, displaying "(90min)" next to tasks. Helps prevent unrealistic planning.</li>
        <li><strong>Category Coloring</strong>: Detects keywords like "Lunch", "Travel", "Meeting", "Sleep" and applies color tags automatically.</li>
        <li><strong>Image Export</strong>: Save your organized schedule as an image to share on Slack, Discord, or Social Media.</li>
      </ul>
    `
  },

  "/tools/romaji-converter": {
    title: "Romaji Converter Pro | Hepburn & Kunrei - Quikit.info",
    description: "Convert Japanese Kana to Romaji instantly. Supports Passport style (Hepburn) and School style (Kunrei). Includes reverse conversion.",
    content: `
      <h1>Romaji Converter Pro</h1>
      <p>A professional tool to convert Japanese (Hiragana/Katakana) into Romaji (Latin script). Essential for business cards, credit card applications, and passport forms.</p>

      <h2>Supported Standards</h2>
      <h3>✈️ Hepburn System (Hebon-shiki)</h3>
      <p>Based on English pronunciation. The standard for <strong>Passports, Road Signs, and Railway Stations</strong> in Japan.</p>
      <ul>
        <li>Example: "し" → SHI, "つ" → TSU, "ふ" → FU</li>
      </ul>

      <h3>🏫 Kunrei System (ISO 3602)</h3>
      <p>Based on Japanese Kana logic. Taught in Japanese elementary schools and used in some academic contexts.</p>
      <ul>
        <li>Example: "し" → SI, "つ" → TU, "ふ" → HU</li>
      </ul>

      <h2>Useful Features</h2>
      <ul>
        <li><strong>Reverse Conversion</strong>: Convert Romaji ("konnichiwa") back to Japanese ("こんにちは"). Useful for language learners.</li>
        <li><strong>Case Unification</strong>: One-click formatting to UPPERCASE, lowercase, or Capitalize.</li>
      </ul>
    `
  },

  "/tools/chart-maker": {
    title: "Chart Maker | Create Graphs Online Free - Quikit.info",
    description: "No Excel needed. Paste data to generate professional Bar, Line, Pie, and Radar charts. Save as transparent PNG for presentations.",
    content: `
      <h1>Chart Maker</h1>
      <p>"I need a chart for a slide, but opening Excel is too slow." This browser-based tool is the solution. Turn CSV text into beautiful visualizations instantly.</p>

      <h2>3 Easy Steps</h2>
      <ol>
        <li><strong>Input Data</strong>: Type labels and numbers, or paste from a spreadsheet.</li>
        <li><strong>Customize</strong>: Choose chart type, adjust colors, and set titles.</li>
        <li><strong>Download</strong>: Save as a high-res PNG (with optional transparent background) and paste into your presentation.</li>
      </ol>

      <h2>Supported Chart Types</h2>
      <ul>
        <li><strong>Bar Chart</strong>: For comparing quantities (e.g., Sales by Month).</li>
        <li><strong>Line Chart</strong>: For trends over time (e.g., Stock prices, Weight).</li>
        <li><strong>Pie / Donut Chart</strong>: For proportions (e.g., Market share, Budget).</li>
        <li><strong>Radar Chart</strong>: For multi-variable evaluation (e.g., Skill sets).</li>
        <li><strong>Histogram</strong>: For distribution analysis.</li>
      </ul>
    `
  },

  "/tools/calorie-checker": {
    title: "Calorie & BMI Calculator | TDEE & BMR - Quikit.info",
    description: "Calculate BMI, BMR, and TDEE (Total Daily Energy Expenditure) based on your body metrics. Essential for scientific weight loss and muscle gain.",
    content: `
      <h1>Calorie & BMI Calculator</h1>
      <p>Successful dieting and body composition rely on numbers, not guesses. This tool calculates your key health metrics using the latest scientific formulas.</p>

      <h2>What You Can Calculate</h2>
      <h3>1. BMI (Body Mass Index) & Ideal Weight</h3>
      <p>A global standard for obesity. Check if you are "Underweight", "Normal", or "Overweight" based on WHO standards. We also calculate your statistically healthiest weight.</p>

      <h3>2. BMR (Basal Metabolic Rate)</h3>
      <p>The minimum energy your body burns just to stay alive (breathing, temperature control). We use the reliable Mifflin-St Jeor and Harris-Benedict equations.</p>

      <h3>3. TDEE (Total Daily Energy Expenditure)</h3>
      <p>Your actual daily calorie burn, including activity and exercise.</p>
      <ul>
        <li><strong>To Lose Weight</strong>: Eat less than your TDEE.</li>
        <li><strong>To Gain Muscle</strong>: Eat more than your TDEE.</li>
      </ul>
      <p>Knowing your TDEE is the first step to controlling your physique.</p>
    `
  },

  "/tools/palettegen": {
    title: "Palette Generator | Color Theory Tool - Quikit.info",
    description: "Generate beautiful color schemes from a single base color using Color Theory algorithms. For designers, illustrators, and developers.",
    content: `
      <h1>Palette Generator (Based on Color Theory)</h1>
      <p>Color selection isn't just about intuition; it's about logic. This tool uses mathematical algorithms on the color wheel to generate harmonious palettes from your chosen base color.</p>

      <h2>Generated Harmonies</h2>
      <dl>
        <dt>Monochromatic</dt>
        <dd>Variations in lightness and saturation of a single color. Creates a clean, cohesive, and soothing look.</dd>

        <dt>Analogous</dt>
        <dd>Colors that are next to each other on the color wheel. Found often in nature, they are pleasing to the eye.</dd>

        <dt>Complementary</dt>
        <dd>Colors opposite each other on the wheel. Creates high contrast and high impact. Great for Call-To-Action buttons.</dd>

        <dt>Triadic</dt>
        <dd>Three colors evenly spaced on the wheel. Offers a vibrant and balanced color scheme.</dd>
      </dl>

      <p>Click any color to copy its HEX code instantly. Ready for use in CSS, Photoshop, or Figma.</p>
    `
  }
};
