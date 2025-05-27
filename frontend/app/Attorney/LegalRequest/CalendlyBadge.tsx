// components/CalendlyBadge.tsx
import { useEffect } from 'react';

interface CalendlyBadgeProps {
  calendlyUrl: string;
}

export default function CalendlyBadge({ calendlyUrl }: CalendlyBadgeProps) {
  useEffect(() => {
    // Load Calendly script only once
    const head = document.querySelector('head');
    if (!document.querySelector('#calendly-style')) {
      const link = document.createElement('link');
      link.id = 'calendly-style';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      head?.appendChild(link);
    }

    if (!document.querySelector('#calendly-script')) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        if (window.Calendly) {
          window.Calendly.initBadgeWidget({
            url: calendlyUrl,
            text: 'Schedule time with Client',
            color: '#23477b',
            textColor: '#ffffff',
          });
        }
      };
      head?.appendChild(script);
    } else {
      // If script is already there and Calendly is loaded
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({
          url: calendlyUrl,
          text: 'Schedule time with Client',
          color: '#23477b',
          textColor: '#ffffff',
        });
      }
    }
  }, [calendlyUrl]);

  return null; // No visible component — Calendly will render the badge automatically
}
