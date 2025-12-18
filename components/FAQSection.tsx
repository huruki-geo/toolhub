// src/components/FAQSection.tsx
import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  lang: 'JP' | 'EN';
  type: 'top' | 'tool';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang, type }) => {
  const topFAQs: { JP: FAQItem[]; EN: FAQItem[] } = {
    JP: [
      {
        question: 'ToolPark.infoとは何ですか？',
        answer: 'ToolPark.infoは、便利なWebベースのツールを集めて整理したディレクトリサイトです。登録不要で、様々なオンラインツールを無料でご利用いただけます。'
      },
      {
        question: 'ToolPark.infoのツールは無料で使えますか？',
        answer: 'はい、ToolPark.infoで提供しているツールはすべて完全無料でご利用いただけます。会員登録やログインも不要です。'
      },
      {
        question: 'ToolPark.infoはこれらのツールを開発していますか？',
        answer: 'はい、ToolPark.infoは自社で開発したツールを提供しています。すべてのツールはプライバシーを重視し、ブラウザ内で動作するよう設計されています。'
      }
    ],
    EN: [
      {
        question: 'What is ToolPark.info?',
        answer: 'ToolPark.info is a curated directory that collects and organizes useful web-based tools. All tools are free to use without registration.'
      },
      {
        question: 'Are the tools on ToolPark.info free to use?',
        answer: 'Yes, all tools provided by ToolPark.info are completely free to use. No registration or login is required.'
      },
      {
        question: 'Does ToolPark.info develop these tools?',
        answer: 'Yes, ToolPark.info develops its own tools. All tools are designed to run in the browser with a focus on privacy.'
      }
    ]
  };

  const toolFAQs: { JP: FAQItem[]; EN: FAQItem[] } = {
    JP: [
      {
        question: 'このツールはToolPark.infoが運営していますか？',
        answer: 'はい、このツールはToolPark.infoが開発・運営しています。ブラウザ上で動作し、サーバーにデータを送信しないプライバシー重視の設計です。'
      },
      {
        question: 'このツールは無料で使えますか？',
        answer: 'はい、完全無料でご利用いただけます。会員登録やログインも不要です。'
      },
      {
        question: 'このツールを使うにはログインが必要ですか？',
        answer: 'いいえ、ログインは不要です。ブラウザを開いてすぐにご利用いただけます。'
      }
    ],
    EN: [
      {
        question: 'Is this tool operated by ToolPark.info?',
        answer: 'Yes, this tool is developed and operated by ToolPark.info. It runs in the browser and is designed with privacy in mind, not sending data to servers.'
      },
      {
        question: 'Is this tool free to use?',
        answer: 'Yes, it is completely free to use. No registration or login is required.'
      },
      {
        question: 'Is login required to use this tool?',
        answer: 'No, login is not required. You can start using it immediately by opening your browser.'
      }
    ]
  };

  const faqs = type === 'HOME' ? topFAQs[lang] : toolFAQs[lang];
  const title = lang === 'JP' ? 'よくある質問' : 'Frequently Asked Questions';

  return (
    <section className="bg-white border-t border-slate-200 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          {title}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-emerald-300"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-slate-900 text-lg list-none">
                <span className="pr-8">{faq.question}</span>
                <svg
                  className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-4 pt-2 text-slate-700 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
