import { ElementRef, useRef } from 'react';

const sleep = (ms?: number) => new Promise((r) => setTimeout(r, ms));

export const useMessageSender = () => {
  const iframeElementRef = useRef<ElementRef<'iframe'>>(null);

  const iframeSourceDoc = `<!DOCTYPE html>
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  const sendMessageToIframe = async (message: string) => {
    if (!iframeElementRef.current) return;
    iframeElementRef.current.srcdoc = iframeSourceDoc;
    await sleep(50);
    const iframeWindow = iframeElementRef.current.contentWindow;
    iframeWindow?.postMessage(message, '*');
  };

  return {
    sendMessageToIframe,
    iframeElementRef,
    iframeSourceDoc,
  };
};
