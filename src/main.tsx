import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <>
      <App />
      <Toaster position="bottom-right" richColors closeButton />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
