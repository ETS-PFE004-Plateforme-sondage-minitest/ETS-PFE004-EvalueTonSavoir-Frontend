import React, { useState } from 'react';
// import { parse, GIFTQuestion } from 'gift-pegjs';
import Editor from './Editor';
import Preview from './Preview';

import './EditorPreview.css';

interface EditorPreviewProps {
    initialValue: string;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ initialValue }) => {
    const [value, setValue] = useState(initialValue);
    // const [parsedValue, setParsedValue] = useState<GIFTQuestion[]>([]);

    const handleUpdatePreview = (newValue: string) => {
        setValue(newValue);
        // setParsedValue(parse(newValue));
    };

    return (
        <div id="editor-preview-container" className="container">
            <Editor initialValue={initialValue} onEditorChange={handleUpdatePreview} />
            <Preview questions={value} />
        </div>
    );
};

export default EditorPreview;
