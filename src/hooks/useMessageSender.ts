import { ElementRef, useRef } from 'react';

export const useMessageSender = () => {
  const iframeElementRef = useRef<ElementRef<'iframe'>>(null);

  const iframeSourceDoc = `<!DOCTYPE html>
    <html>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', event => {
            try {
              eval(event.data);
            } catch (error) {
              console.error(error);
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
            }
          });
        </script>
      </body>
    </html>
  `;

  const sendMessageToIframe = (message: string) => {
    if (!iframeElementRef.current) return;
    iframeElementRef.current.srcdoc = iframeSourceDoc;

    const iframeWindow = iframeElementRef.current.contentWindow;
    iframeWindow?.postMessage(message, '*');
  };

  return {
    sendMessageToIframe,
    iframeElementRef,
    iframeSourceDoc,
  };
};
