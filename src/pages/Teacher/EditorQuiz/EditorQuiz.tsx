import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Editor from '../../../components/EditorPreview/Editor';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

import '../../../components/EditorPreview/EditorPreview.css';

interface Quiz {
    id: string;
    title: string;
    questions: string[];
}

interface EditQuizParams {
    id: string;
    [key: string]: string | undefined;
}

const QuizForm: React.FC = () => {
    const { id } = useParams<EditQuizParams>();
    const [value, setValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<string[]>([]);
    const [quizToSave, setQuizToSave] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch quiz from local storage
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const quizToEdit = storedQuizzes.find((q: Quiz) => q.id === id);
        if (quizToEdit) {
            setFilteredValue(quizToEdit.questions);
            setValue(quizToEdit.questions.join('\n\n'));
            setQuizTitle(quizToEdit.title);
        }
    }, [id]);

    function handleEditorChange(value: string) {
        setValue(value);
    }

    function handleUpdatePreview() {
        const linesArray = value.split(/(?<=\}.*)[\n]+/); // Split at next line breaks after closing curly brace
        if (linesArray[linesArray.length - 1] === '') linesArray.pop(); // Remove last empty line
        setFilteredValue(linesArray);
    }

    const handleSaveQuiz = () => {
        setQuizToSave(true);
    };

    const handleQuizTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuizTitle(event.target.value);
    };

    const handleModalClose = () => {
        setQuizToSave(false);
        setQuizTitle('');
    };

    const handleQuizSave = () => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const newQuiz = {
            id: uuidv4(),
            title: quizTitle || 'Untitled quiz',
            questions: filteredValue
        };
        const updatedQuizzes = id
            ? storedQuizzes.map((q: Quiz) =>
                  q.id === id ? { ...q, title: quizTitle, questions: filteredValue } : q
              )
            : [...storedQuizzes, newQuiz];
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        alert('Quiz saved!');
        handleModalClose();
        navigate('/teacher/dashboard');
    };

    return (
        <div>
            <div id="editor-preview-container" className="container">
                <div className="editor-column">
                    <Editor initialValue={value} onEditorChange={handleEditorChange} />
                    <div className="quiz-action-buttons">
                        <a onClick={handleUpdatePreview}>Prévisualisation</a>
                        <a onClick={handleSaveQuiz}>Enregistrer</a>
                    </div>
                </div>
                <div className="preview-column">
                    <GIFTTemplatePreview questions={filteredValue} />
                </div>
            </div>
            {quizToSave && (
                <Modal
                    title="Sauvegarder le questionnaire"
                    message="Entrez un titre pour votre questionnaire:"
                    hasOptionalInput
                    optionalInputValue={quizTitle}
                    onOptionalInputChange={handleQuizTitleChange}
                    onConfirm={handleQuizSave}
                    onCancel={handleModalClose}
                />
            )}
        </div>
    );
};

export default QuizForm;
