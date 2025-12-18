// src/data/schema.ts
// JSON-LD構造化データの定義

export interface SchemaOrg {
  '@context': string;
  '@graph': any[];
}

// FAQのHTML生成
export const generateFAQHTML = (lang: 'JP' | 'EN', type: 'top' | 'tool'): string => {
  const topFAQs = lang === 'JP' ? [
    {
      q: 'ToolPark.infoとは何ですか？',
      a: 'ToolPark.infoは、便利なWebベースのツールを集めて整理したディレクトリサイトです。登録不要で、様々なオンラインツールを無料でご利用いただけます。'
    },
    {
      q: 'ToolPark.infoのツールは無料で使えますか？',
      a: 'はい、ToolPark.infoで提供しているツールはすべて完全無料でご利用いただけます。会員登録やログインも不要です。'
    },
    {
      q: 'ToolPark.infoはこれらのツールを開発していますか？',
      a: 'はい、ToolPark.infoは自社で開発したツールを提供しています。すべてのツールはプライバシーを重視し、ブラウザ内で動作するよう設計されています。'
    }
  ] : [
    {
      q: 'What is ToolPark.info?',
      a: 'ToolPark.info is a curated directory that collects and organizes useful web-based tools. All tools are free to use without registration.'
    },
    {
      q: 'Are the tools on ToolPark.info free to use?',
      a: 'Yes, all tools provided by ToolPark.info are completely free to use. No registration or login is required.'
    },
    {
      q: 'Does ToolPark.info develop these tools?',
      a: 'Yes, ToolPark.info develops its own tools. All tools are designed to run in the browser with a focus on privacy.'
    }
  ];

  const toolFAQs = lang === 'JP' ? [
    {
      q: 'このツールはToolPark.infoが運営していますか？',
      a: 'はい、このツールはToolPark.infoが開発・運営しています。ブラウザ上で動作し、サーバーにデータを送信しないプライバシー重視の設計です。'
    },
    {
      q: 'このツールは無料で使えますか？',
      a: 'はい、完全無料でご利用いただけます。会員登録やログインも不要です。'
    },
    {
      q: 'このツールを使うにはログインが必要ですか？',
      a: 'いいえ、ログインは不要です。ブラウザを開いてすぐにご利用いただけます。'
    }
  ] : [
    {
      q: 'Is this tool operated by ToolPark.info?',
      a: 'Yes, this tool is developed and operated by ToolPark.info. It runs in the browser and is designed with privacy in mind, not sending data to servers.'
    },
    {
      q: 'Is this tool free to use?',
      a: 'Yes, it is completely free to use. No registration or login is required.'
    },
    {
      q: 'Is login required to use this tool?',
      a: 'No, login is not required. You can start using it immediately by opening your browser.'
    }
  ];

  const faqs = type === 'top' ? topFAQs : toolFAQs;
  const title = lang === 'JP' ? 'よくある質問' : 'Frequently Asked Questions';

  return `
    <section class="bg-white border-t border-slate-200 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-slate-900 mb-8 text-center">${title}</h2>
        <div class="space-y-6">
          ${faqs.map(faq => `
            <details class="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <summary class="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-slate-900 text-lg list-none">
                <span class="pr-8">${faq.q}</span>
                <svg class="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="px-6 pb-4 pt-2 text-slate-700 leading-relaxed">${faq.a}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>
  `;
};

// サイト全体の共通スキーマ（FAQなし）
export const getWebsiteSchema = (lang: 'JP' | 'EN'): any => ({
  '@type': 'WebSite',
  '@id': `https://toolpark.info/${lang === 'EN' ? 'en/' : ''}#website`,
  name: 'ToolPark.info',
  url: `https://toolpark.info/${lang === 'EN' ? 'en/' : ''}`,
  description: lang === 'JP' 
    ? '登録不要・完全無料のWebツール集。タイマー、画像編集、計算機など、スマホ・PCで今すぐ使える便利なツールを提供。'
    : 'A curated directory of useful web-based tools. Free, no registration required. Accessible on smartphones and PCs.',
  inLanguage: lang === 'JP' ? 'ja' : 'en'
});

// トップページ用FAQ（固定・共通）
export const getTopPageFAQ = (lang: 'JP' | 'EN'): any => ({
  '@type': 'FAQPage',
  '@id': `https://toolpark.info/${lang === 'EN' ? 'en/' : ''}#faq`,
  mainEntity: lang === 'JP' ? [
    {
      '@type': 'Question',
      name: 'ToolPark.infoとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ToolPark.infoは、便利なWebベースのツールを集めて整理したディレクトリサイトです。登録不要で、様々なオンラインツールを無料でご利用いただけます。'
      }
    },
    {
      '@type': 'Question',
      name: 'ToolPark.infoのツールは無料で使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、ToolPark.infoで提供しているツールはすべて完全無料でご利用いただけます。会員登録やログインも不要です。'
      }
    },
    {
      '@type': 'Question',
      name: 'ToolPark.infoはこれらのツールを開発していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、ToolPark.infoは自社で開発したツールを提供しています。すべてのツールはプライバシーを重視し、ブラウザ内で動作するよう設計されています。'
      }
    }
  ] : [
    {
      '@type': 'Question',
      name: 'What is ToolPark.info?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ToolPark.info is a curated directory that collects and organizes useful web-based tools. All tools are free to use without registration.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are the tools on ToolPark.info free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all tools provided by ToolPark.info are completely free to use. No registration or login is required.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does ToolPark.info develop these tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, ToolPark.info develops its own tools. All tools are designed to run in the browser with a focus on privacy.'
      }
    }
  ]
});

// トップページ用CollectionPage
export const getCollectionPageSchema = (lang: 'JP' | 'EN'): any => ({
  '@type': 'CollectionPage',
  '@id': `https://toolpark.info/${lang === 'EN' ? 'en/' : ''}#top`,
  name: lang === 'JP' ? 'ToolPark.info - 登録不要・完全無料のWebツール集' : 'ToolPark.info - Web Tools Directory',
  description: lang === 'JP' 
    ? '登録不要・完全無料で使える便利なWebツールを集めたディレクトリ。タイマー、画像編集、計算機など、スマホ・PCで今すぐ利用可能。'
    : 'Browse a curated collection of useful online tools. Free, no registration required, accessible on smartphones and PCs.',
  isAccessibleForFree: true
});

// ツール個別ページ用FAQ（固定・共通）
export const getToolPageFAQ = (lang: 'JP' | 'EN', toolPath: string): any => ({
  '@type': 'FAQPage',
  '@id': `https://toolpark.info${toolPath}#faq`,
  mainEntity: lang === 'JP' ? [
    {
      '@type': 'Question',
      name: 'このツールはToolPark.infoが運営していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、このツールはToolPark.infoが開発・運営しています。ブラウザ上で動作し、サーバーにデータを送信しないプライバシー重視の設計です。'
      }
    },
    {
      '@type': 'Question',
      name: 'このツールは無料で使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、完全無料でご利用いただけます。会員登録やログインも不要です。'
      }
    },
    {
      '@type': 'Question',
      name: 'このツールを使うにはログインが必要ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ、ログインは不要です。ブラウザを開いてすぐにご利用いただけます。'
      }
    }
  ] : [
    {
      '@type': 'Question',
      name: 'Is this tool operated by ToolPark.info?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, this tool is developed and operated by ToolPark.info. It runs in the browser and is designed with privacy in mind, not sending data to servers.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this tool free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is completely free to use. No registration or login is required.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is login required to use this tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, login is not required. You can start using it immediately by opening your browser.'
      }
    }
  ]
});

// ツール個別ページ用SoftwareApplication
export const getToolSchema = (tool: any, lang: 'JP' | 'EN'): any => {
  const toolPath = lang === 'EN' ? `/en${tool.path}` : tool.path;
  const toolName = lang === 'JP' ? tool.nameJp : tool.name;
  const toolDesc = lang === 'JP' ? tool.description.jp : tool.description.en;

  return {
    '@type': 'SoftwareApplication',
    '@id': `https://toolpark.info${toolPath}#software`,
    name: toolName,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    url: `https://toolpark.info${toolPath}`,
    description: toolDesc,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
};

// 完全なJSON-LDを生成（トップページ用）
export const generateTopPageSchema = (lang: 'JP' | 'EN'): SchemaOrg => ({
  '@context': 'https://schema.org',
  '@graph': [
    getWebsiteSchema(lang),
    getCollectionPageSchema(lang),
    getTopPageFAQ(lang)
  ]
});

// 完全なJSON-LDを生成（ツール個別ページ用）
export const generateToolPageSchema = (tool: any, lang: 'JP' | 'EN'): SchemaOrg => {
  const toolPath = lang === 'EN' ? `/en${tool.path}` : tool.path;
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getWebsiteSchema(lang),
      getToolSchema(tool, lang),
      getToolPageFAQ(lang, toolPath)
    ]
  };
};
