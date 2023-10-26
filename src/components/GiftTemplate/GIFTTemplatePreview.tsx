import React, { useEffect, useState } from 'react';
import Template, { ErrorTemplate } from "./templates";
import { GIFTQuestion } from "./templates/types";
import "./styles.css";

interface GIFTTemplatePreviewProps {
  questions: GIFTQuestion[];
}
  
const GIFTTemplatePreview: React.FC<GIFTTemplatePreviewProps> = ({ questions }) => {
  const [error, setError] = useState('');
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [items, setItems] = useState('');
  const [errorItem, setErrorItem] = useState('');

  // const state: DisplayOptions = { preview: true, theme: "light" };

  useEffect(() => {
    try {
      setItems(questions
          .map((item) => Template(item, { preview: true, theme: "light" }))
          .join("")
      );
      setErrorItem(ErrorTemplate("Hello"));

      setIsPreviewReady(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      else {
        setError('An error occurred while generating the preview.');
      }
    }
  }, [questions]);

  const PreviewComponent = () => (
    <React.Fragment>
      {error ? (
        <div className="error">{error}</div>
      ) : isPreviewReady ? (
        <div
          className="preview-container"
          dangerouslySetInnerHTML={{ __html: items + errorItem }}
        ></div>
      ) : (
        <div className="loading">Loading preview...</div>
      )}
    </React.Fragment>
  );

  return <PreviewComponent />;
};

export default GIFTTemplatePreview;