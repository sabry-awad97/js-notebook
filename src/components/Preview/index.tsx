import { FC, useEffect } from 'react';
import { useMessageSender } from '../../hooks/useMessageSender';

interface Props {
  code: string;
  errorMessage: string;
}

const Preview: FC<Props> = ({ code, errorMessage }) => {
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
      />
      {errorMessage && <div className="preview-error">{errorMessage}</div>}
    </div>
  );
};

export default Preview;
