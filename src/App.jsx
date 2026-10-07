import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { I18nProvider } from '@/lib/i18n';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ImprintPage from '@/pages/ImprintPage';
import PrivacyPage from '@/pages/PrivacyPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <Router>
      <I18nProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/de" replace />} />
          <Route element={<Layout />}>
            {/* Deutsch */}
            <Route path="/de" element={<HomePage />} />
            <Route path="/de/leistungen" element={<Navigate to="/de#leistungen" replace />} />
            <Route path="/de/leistungen/:slug" element={<Navigate to="/de#leistungen" replace />} />
            <Route path="/de/kontakt" element={<Navigate to="/de#kontakt" replace />} />
            <Route path="/de/impressum" element={<ImprintPage />} />
            <Route path="/de/datenschutz" element={<PrivacyPage />} />
            {/* English */}
            <Route path="/en" element={<HomePage />} />
            <Route path="/en/services" element={<Navigate to="/en#leistungen" replace />} />
            <Route path="/en/services/:slug" element={<Navigate to="/en#leistungen" replace />} />
            <Route path="/en/contact" element={<Navigate to="/en#kontakt" replace />} />
            <Route path="/en/imprint" element={<ImprintPage />} />
            <Route path="/en/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </I18nProvider>
    </Router>
  )
}

export default App
