import { ElementRef, useRef, useState } from 'react';
import { useEsbuild } from '../bundler/hooks';

export const useCodeTransformer = () => {
  const transformCode = useEsbuild();
  const [transforming, setTransforming] = useState(false);
  const iframeRef = useRef<ElementRef<'iframe'>>(null);

  const srcDoc = `<!DOCTYPE html>
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
    if (!iframeRef.current) return;
    iframeRef.current.srcdoc = srcDoc;

    const iframeWindow = iframeRef.current.contentWindow;
    iframeWindow?.postMessage(message, '*');
  };

  const onClick = async (input: string) => {
    setTransforming(true);
    try {
      const transformedCode = await transformCode(input);
      sendMessageToIframe(transformedCode);
    } catch (error) {
      console.error('Error transforming code:', error);
    } finally {
      setTransforming(false);
    }
  };

  return { onClick, transforming, iframeRef, srcDoc };
};
