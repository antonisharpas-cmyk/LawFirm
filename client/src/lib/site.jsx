import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const FALLBACK = {
  firm_name: 'Athanasiadou Law Firm',
  email: 'info@athanasiadoulaw.com',
  phone: '+357 24 044835',
  address_line1: 'Panagioti Kanellopoulou 18, Sakkas Court 3, Office 102',
  address_line2: '6057 Larnaca, Cyprus',
  hours: 'Monday to Friday, 9:00 to 17:00'
};

const SiteContext = createContext({ settings: FALLBACK, areas: [], lawyers: [], loaded: false });

export function SiteProvider({ children }) {
  const [state, setState] = useState({ settings: FALLBACK, areas: [], lawyers: [], loaded: false });

  useEffect(() => {
    Promise.all([
      api('/api/settings').catch(() => FALLBACK),
      api('/api/practice-areas').catch(() => []),
      api('/api/lawyers').catch(() => [])
    ]).then(([settings, areas, lawyers]) => setState({ settings: { ...FALLBACK, ...settings }, areas, lawyers, loaded: true }));
  }, []);

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

export const telHref = (p = '') => `tel:${p.replace(/[^\d+]/g, '')}`;
