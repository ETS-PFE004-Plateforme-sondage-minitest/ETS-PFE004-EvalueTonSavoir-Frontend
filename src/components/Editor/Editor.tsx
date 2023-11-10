import React, { useState } from 'react';

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

    console.log('value', value);

    return (
        <textarea
            onChange={handleEditorChange}
            defaultValue={value}
            style={{
                resize: 'vertical',
                width: '100%',
                height: '80vh'
            }}
        ></textarea>
    );
};

export default Editor;
