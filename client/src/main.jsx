import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { handleClientMockApi } from './clientStorage.js'

// Transparent fetch interceptor for GitHub Pages (Static hosting)
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : (input?.url || '');

  // If on GitHub Pages or static host, route API directly to client mock storage
  if (url.includes('/api/') || url.startsWith('api/')) {
    if (window.location.hostname.includes('github.io')) {
      try {
        const mockResult = await handleClientMockApi(url, init);
        return new Response(JSON.stringify(mockResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Otherwise, try standard fetch with fallback
    try {
      const response = await originalFetch(input, init);
      if (!response.ok && response.status === 404) {
        // Fallback if backend API endpoint not reachable
        const mockResult = await handleClientMockApi(url, init);
        return new Response(JSON.stringify(mockResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return response;
    } catch (netErr) {
      // Fallback on network failure
      const mockResult = await handleClientMockApi(url, init);
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
