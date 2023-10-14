import React, { useEffect, useState } from 'react';
import { parse } from 'gift-pegjs';
import giftPreviewHTML from './giftPreview.js';
import './giftPreview.css';

interface PreviewProps {
  questions: string;
}

const Preview: React.FC<PreviewProps> = ({ questions }) => {
  const [theDiv, setTheDiv] = useState(document.createElement('div'));
  const [error, setError] = useState('');
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  useEffect(() => {
    try {
      const newDiv = document.createElement('div');
      giftPreviewHTML(parse(questions), newDiv);
      setTheDiv(newDiv);
      setIsPreviewReady(true);
      setError('');
    } catch (error: any) {
      setError('An error occurred while generating the preview.');
    }
  }, [questions]);

  const PreviewComponent = () => (
    <React.Fragment>
      {error ? (
        <div className="error">{error}</div>
      ) : isPreviewReady ? (
        <div
          className="preview-container"
          dangerouslySetInnerHTML={{ __html: theDiv.innerHTML }}
        ></div>
      ) : (
        <div className="loading">Loading preview...</div>
      )}
    </React.Fragment>
  );

  return <PreviewComponent />;
};

export default Preview;