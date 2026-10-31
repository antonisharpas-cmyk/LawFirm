import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const FALLBACK = {
  firm_name: 'H.A. Andreou & Co',
  legal_name: 'Helena Antonis Andreou LLC',
  email: 'info@ahllc.com.cy',
  phone: '+357 24 656765',
  fax: '+357 24 824424',
  address_line1: '4 United Nations Street, Anastasia Building, 2nd & 3rd Floor',
  address_line2: '6042 Larnaca, Cyprus',
  map_location: 'Inomenon Ethnon 4, Larnaca 6042, Cyprus',
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
