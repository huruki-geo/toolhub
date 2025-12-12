import React, { useEffect } from 'react';
import { ViewState, Language } from '../types';
import { TOOLS } from '../constants';

interface Props {
  view: ViewState;
  lang: Language;
}

export const SEOHead: React.FC<Props> = ({ view, lang }) => {
  return null; // This component does not render UI
};
