import React, { useEffect, useState } from 'react';
import { GIFTQuestion, parse } from 'gift-pegjs';
import giftPreviewHTML from './giftPreview.js';
import './giftPreview.css';

interface PreviewProps {
  questions: string;
  showAnswers?: boolean;
  giftQuestions?: GIFTQuestion[];
}

const Preview: React.FC<PreviewProps> = ({ questions, showAnswers, giftQuestions }) => {
  const [theDiv, setTheDiv] = useState(document.createElement('div'));
  const [error, setError] = useState('');
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  useEffect(() => {
    try {
      const newDiv = document.createElement('div');
      giftPreviewHTML(giftQuestions ? giftQuestions : parse(questions), newDiv, showAnswers);
      setTheDiv(newDiv);
      setIsPreviewReady(true);
      setError('');
    } catch (error: any) {
      setError('An error occurred while generating the preview.');
    }
  }, [questions, giftQuestions]);

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