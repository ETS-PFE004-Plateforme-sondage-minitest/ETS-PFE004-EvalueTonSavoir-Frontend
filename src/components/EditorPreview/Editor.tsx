import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  initialValue: string;
  onEditorChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange }) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<ReactQuill | null>(null);

  function handleEditorChange(value: string) {
    const text = editorRef.current?.getEditor().getText();
    setValue(value);
    onEditorChange(text || '');
  }

  return (
      <ReactQuill
        ref={editorRef}
        value={value}
        onChange={handleEditorChange}
      />
  );
};

export default Editor;