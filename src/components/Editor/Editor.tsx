// Editor.tsx
import React, { useState, useRef } from 'react';
import './Editor.css';

interface EditorProps {
    initialValue: string;
    onEditorChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange }) => {
    const [value, setValue] = useState(initialValue);
    const [imageUrl, setImageUrl] = useState('');
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    function handleEditorChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value;
        setValue(text);
        onEditorChange(text || '');
    }

    function insertImageTag() {
        if (editorRef.current && imageUrl.trim() !== '') {
            const currentCursorPosition = editorRef.current.selectionStart;
            // Ajoutez le \ avant le : dans le lien de l'image
            const imageUrlWithBackslash = imageUrl.replace(/:/g, "\\:");
            const newContent =
                value.substring(0, currentCursorPosition) + `<img src\\="${imageUrlWithBackslash}" />` + value.substring(currentCursorPosition);
            setValue(newContent);
            onEditorChange(newContent);
            setImageUrl('');
        }
    }


    return (
        <div>
            <textarea ref={editorRef} onChange={handleEditorChange} value={value} className="editor"></textarea>
            <div>
                <label>URL de l'image:</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <button onClick={insertImageTag}>Insérer une image</button>
            </div>
        </div>    );
};

export default Editor;
