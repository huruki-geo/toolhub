import React, { useEffect } from 'react';
import { ViewState, Language } from '../types';
import { TOOLS } from '../constants';

interface Props {
  view: ViewState;
  lang: Language;
}

export const SEOHead: React.FC<Props> = ({ view, lang }) => {
  useEffect(() => {
    let title = 'ToolsHub';
    let description = 'Free, fast, and privacy-focused web tools collection.';

    if (view !== 'HOME') {
      const tool = TOOLS.find(t => t.id === view);
      if (tool) {
        title = `${lang === 'JP' ? tool.nameJp : tool.name} | ToolsHub`;
        description = lang === 'JP' ? tool.description.jp : tool.description.en;
      }
    } else {
        if (lang === 'JP') {
            description = 'インストール不要、完全無料のWebツール集。タイマー、グラフ作成、計算機など。';
        }
    }

    // Update Title
    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

  }, [view, lang]);

  return null; // This component does not render UI
};