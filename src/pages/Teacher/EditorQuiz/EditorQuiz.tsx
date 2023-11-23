// EditorQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Editor from '../../../components/Editor/Editor';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';
import GoBackButton from '../../../components/GoBackButton/GoBackButton';
import Modal from '../../../components/ConfirmDialog/ConfirmDialog';

import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';

import './EditorQuiz.css';
import { Button } from '@mui/material';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';

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
        const linesArray = value.split(/(?<=^|[^\\]}.*)[\n]+/); // Split at next line breaks after closing curly brace not preceded by a backslash
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
        handleModalClose();
        navigate('/teacher/dashboard');
    };

    if (!isNewQuiz) {
        if (!quiz) {
            return <div>Chargement...</div>;
        }
    }

    return (
        <div className="edit-page-container">
            <h1 className="page-title">Éditeur de quiz</h1>
            {/* <GoBackButton
                askConfirm
                message={`Êtes-vous sûr de vouloir quitter l'éditeur sans sauvegarder le questionnaire ?`}
            /> */}
            <div className="container">
                <div>
                    <h2 className="subtitle">Éditeur</h2>
                    <div className="editor-container">
                        <Editor initialValue={value} onEditorChange={handleUpdatePreview} />
                        <Button variant="contained" onClick={handleSaveQuiz}>
                            Enregistrer
                        </Button>
                    </div>
                    <GiftCheatSheet />
                </div>
                <div className="preview-column">
                    <h2 className="subtitle">Prévisualisation</h2>
                    <GIFTTemplatePreview questions={filteredValue} />
                </div>
            </div>
            <ConfirmDialog
                open={quizToSave}
                title="Sauvegarder le questionnaire"
                message="Entrez un titre pour votre questionnaire:"
                hasOptionalInput
                optionalInputValue={quizTitle}
                onOptionalInputChange={handleQuizTitleChange}
                onConfirm={handleQuizSave}
                onCancel={handleModalClose}
            />
        </div>
    );
};

export default QuizForm;
