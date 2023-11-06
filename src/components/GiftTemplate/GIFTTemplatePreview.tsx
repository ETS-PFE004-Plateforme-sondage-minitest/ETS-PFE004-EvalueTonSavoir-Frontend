import React, { useEffect, useState } from 'react';
import Template, { ErrorTemplate } from './templates';
import { parse } from 'gift-pegjs';
import './styles.css';

interface GIFTTemplatePreviewProps {
    questions: string[];
    hideAnswers?: boolean;
}

const GIFTTemplatePreview: React.FC<GIFTTemplatePreviewProps> = ({
    questions,
    hideAnswers = false
}) => {
    const [error, setError] = useState('');
    const [isPreviewReady, setIsPreviewReady] = useState(false);
    const [items, setItems] = useState('');

    useEffect(() => {
        try {
            let previewHTML = '';
            questions.forEach((item) => {
                try {
                    const parsedItem = parse(item);
                    previewHTML += Template(parsedItem[0], {
                        preview: true,
                        theme: 'light'
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        previewHTML += ErrorTemplate(item + '\n' + error.message);
                    } else {
                        previewHTML += ErrorTemplate(item + '\n' + 'Unknown error');
                    }
                }
                previewHTML += '';
            });
            if (hideAnswers) {
                const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/gi;
                previewHTML = previewHTML.replace(svgRegex, '');
                const placeholderRegex = /(placeholder=")[^"]*(")/gi;
                previewHTML = previewHTML.replace(placeholderRegex, '$1$2');
            }
            setItems(previewHTML);
            setIsPreviewReady(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
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
                    dangerouslySetInnerHTML={{ __html: items }}
                ></div>
            ) : (
                <div className="loading">Loading preview...</div>
            )}
        </React.Fragment>
    );

    return <PreviewComponent />;
};

export default GIFTTemplatePreview;
