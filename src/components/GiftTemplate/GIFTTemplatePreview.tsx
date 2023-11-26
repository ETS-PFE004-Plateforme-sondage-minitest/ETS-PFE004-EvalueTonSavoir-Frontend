// GIFTTemplatePreview.tsx
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
                const isImage = item.includes('<img');
                if (isImage) {
                    const imageUrlMatch = item.match(/<img[^>]+>/i);
                    if (imageUrlMatch) {
                        let imageUrl = imageUrlMatch[0];
                        imageUrl = imageUrl.replace('img', 'img style="width:10vw;" src=');
                        item = item.replace(imageUrlMatch[0], '');
                        previewHTML += `${imageUrl}`;
                    }
                }

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
                        previewHTML += ErrorTemplate(item + '\n' + 'Erreur inconnue');
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
                setError('Une erreur est survenue durant le chargement de la prévisualisation.');
            }
        }
    }, [questions]);

    const PreviewComponent = () => (
        <React.Fragment>
            {error ? (
                <div className="error">{error}</div>
            ) : isPreviewReady ? (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: items }}></div>
                </div>
            ) : (
                <div className="loading">Chargement de la prévisualisation...</div>
            )}
        </React.Fragment>
    );

    return <PreviewComponent />;
};

export default GIFTTemplatePreview;
