import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Editor from '../../../components/Editor/Editor';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';
import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';
import './EditorQuiz.css';
import GoBackButton from '../../../components/GoBackButton/GoBackButton';

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
    const [isNewQuiz, setNewQuiz] = useState(false);
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch quiz from local storage
        const quizToEdit = QuizService.getQuizById(id);
        if (!!quizToEdit) {
            setQuiz(quizToEdit);
            setFilteredValue(quizToEdit.questions);
            setValue(quizToEdit.questions.join('\n\n'));
            setQuizTitle(quizToEdit.title);
        } else {
            setNewQuiz(true);
        }
    }, [id]);

    function handleEditorChange(value: string) {
        setValue(value);
    }

    function handleUpdatePreview(value: string) {
        if (value !== '') {
            handleEditorChange(value);
        }
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
        if (isNewQuiz) {
            const newQuiz = {
                id: uuidv4(),
                title: quizTitle || 'Untitled quiz',
                questions: filteredValue
            };
            const updatedQuizzes = [...storedQuizzes, newQuiz];
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        } else {
            const updatedQuizzes = storedQuizzes.map((q: QuizType) => {
                if (q.id === id) {
                    return { ...q, title: quizTitle, questions: filteredValue };
                }
                return q;
            });
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        }
        alert('Quiz saved!');
        handleModalClose();
        navigate('/teacher/dashboard');
    };

    if (!isNewQuiz) {
        if (!quiz) {
            return <div>Chargement...</div>;
        }
    }

    return (
        <div>
            <h1 className="page-title">Éditeur de quiz</h1>
            <GoBackButton askConfirm message={`Êtes-vous sûr de vouloir quitter l'éditeur sans sauvegarder le questionnaire ?`} />
            <div id="editor-preview-container" className="container">
                <div className="editor-column">
                    <h2 className="subtitle">Éditeur</h2>
                    <Editor initialValue={value} onEditorChange={handleUpdatePreview} />
                    <div className="quiz-action-buttons">
                        <a onClick={handleSaveQuiz}>Enregistrer</a>
                    </div>
                    <GiftCheatSheet />
                </div>

                <div className="preview-column">
                    <h2 className="subtitle">Prévisualisation</h2>
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
