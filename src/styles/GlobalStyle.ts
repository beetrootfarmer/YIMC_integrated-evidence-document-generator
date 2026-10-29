import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.sans};
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Pages are laid out as exact A4 boxes, so the printer must not add its own margins. */
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    body {
      background-color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Hide anything injected outside the app (e.g. the "Powered by Netlify" badge). */
    body > *:not(#root) {
      display: none !important;
    }
  }

  /* Temporary highlight applied to a form section when jumped to via the
     document list's link icon (see Sidebar's scrollToForm). */
  .form-highlight {
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.blue500},
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1) !important;
  }
`;
