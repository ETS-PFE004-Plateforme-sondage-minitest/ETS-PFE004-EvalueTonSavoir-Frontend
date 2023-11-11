import React, { useState } from 'react';
import './Editor.css';

interface EditorProps {
    initialValue: string;
    onEditorChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange }) => {
    const [value, setValue] = useState(initialValue);
    function handleEditorChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value;
        setValue(text);
        onEditorChange(text || '');
    }

    return (
        <textarea onChange={handleEditorChange} defaultValue={value} className="editor"></textarea>
    );
};

export default Editor;
