import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  initialValue: string;
  onEditorChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange }) => {
  const [value, setValue] = useState(initialValue);

  function handleEditorChange(value: string) {
    setValue(value);
    onEditorChange(value);
  }

  return (
      <ReactQuill
        value={value}
        onChange={handleEditorChange}
      />
  );
};

export default Editor;