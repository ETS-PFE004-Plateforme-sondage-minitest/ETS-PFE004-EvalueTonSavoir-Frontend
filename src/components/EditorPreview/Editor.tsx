import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import Markdown  from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { parse as GIFTParse } from 'gift-pegjs';

import 'react-markdown-editor-lite/lib/index.css';
import 'katex/dist/katex.min.css';

interface EditorProps {
  initialValue: string;
  onUpdatedPreview: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onUpdatedPreview }) => {
  const [value, setValue] = useState(initialValue);

  const handleParse = () => {
    try {
      const parsedValue = GIFTParse(value);
      alert(JSON.stringify(parsedValue, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
      else {
        alert('Unknown error');
      }
    }
  };

  const handleUpdatePreview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdatedPreview(value);
  };

  // const renderGIFT = (props: any) => {
  //   const { value } = props;
  //   const parsedValue = GIFTParse(value);
  //   // Code to render parsedValue as HTML
  //   return <div>{parsedValue}</div>;
  // };

  return (
    <div id='editor-container'>
      <form onSubmit={handleUpdatePreview}>
        <MarkdownEditor
          value={value}
          onChange={({ text }) => setValue(text)}
          renderHTML={(text) => (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {text}
            </Markdown>
          )}
        />
        <br />
        <button type="submit">Update Preview</button>
      </form>
      <form onSubmit={handleParse}>
        <button type="submit">Parse</button>
      </form>
    </div>
  );
};

export default Editor;