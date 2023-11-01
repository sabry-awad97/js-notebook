import { FC, useEffect } from 'react';
import { useMessageSender } from '../../hooks/useMessageSender';

interface Props {
  code: string;
}

const Preview: FC<Props> = ({ code }) => {
  const { sendMessageToIframe, iframeElementRef, iframeSourceDoc } =
    useMessageSender();

  useEffect(() => {
    sendMessageToIframe(code);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframeElementRef}
        sandbox="allow-scripts"
        srcDoc={iframeSourceDoc}
        title="Output"
      ></iframe>
    </div>
  );
};

export default Preview;
