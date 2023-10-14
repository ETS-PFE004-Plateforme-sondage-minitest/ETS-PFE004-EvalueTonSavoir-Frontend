// CreateQuiz.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
// import { parse, GIFTQuestion } from 'gift-pegjs';
import Editor from '../../../components/EditorPreview/Editor';
import Preview from '../../../components/EditorPreview/Preview';

import '../../../components/EditorPreview/EditorPreview.css';
import { useNavigate } from 'react-router-dom';


interface CreateQuizProps {
    initialValue: string;
}

const CreateQuiz: React.FC<CreateQuizProps> = () => {
    const [value, setValue] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    // const [parsedValue, setParsedValue] = useState<GIFTQuestion[]>([]);
    const navigate = useNavigate();

    const handleUpdatePreview = (newValue: string) => {
        setValue(newValue);
        // setParsedValue(parse(newValue));
    };

    const handleSaveQuiz = () => {
        setModalIsOpen(true);
      };
    
      const handleModalClose = () => {
        setModalIsOpen(false);
        setQuizTitle('');
      };
    
      const handleQuizTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuizTitle(event.target.value);
      };
    
      const handleQuizSave = () => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const newQuiz = { id: uuidv4(), title: quizTitle || "Untitled quizz", questions: value };
        const updatedQuizzes = [...storedQuizzes, newQuiz];
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        alert('Quiz saved!');
        handleModalClose();
        navigate('/teacher/dashboard');
      };

    return (
        <div id='editor-preview-container' className="container">
            <Editor initialValue='' onUpdatedPreview={handleUpdatePreview} />
            <Preview questions={value} />
            <button onClick={handleSaveQuiz}>Save Quiz</button>
            <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
              <h2>Save Quiz</h2>
              <p>Please enter a title for your quiz:</p>
              <input type="text" value={quizTitle} onChange={handleQuizTitleChange} />
              <button onClick={handleQuizSave}>Save</button>
              <button onClick={handleModalClose}>Cancel</button>
            </Modal>
        </div>
    );
};

export default CreateQuiz;