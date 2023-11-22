// Editor.tsx
import React, { useState, useRef } from 'react';
import './Editor.css';

interface EditorProps {
    initialValue: string;
    onEditorChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange }) => {
    const [value, setValue] = useState(initialValue);
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    function handleEditorChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value;
        setValue(text);
        onEditorChange(text || '');
    }

    return (
        <div>
            <textarea
                ref={editorRef}
                onChange={handleEditorChange}
                value={value}
                className="editor"
            ></textarea>
        </div>
    );
};

export default Editor;
