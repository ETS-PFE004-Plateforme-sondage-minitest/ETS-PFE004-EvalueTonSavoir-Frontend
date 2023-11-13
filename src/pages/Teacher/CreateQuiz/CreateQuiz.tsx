// CreateQuiz.tsx
import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Editor from '../../../components/EditorPreview/Editor';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

import '../../../components/EditorPreview/EditorPreview.css';

interface Quiz {
    id: string;
    title: string;
    questions: string;
  }

const CreateQuiz: React.FC = () => {
    const [value, setValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<string[]>([]);
    const [quizToSave, setQuizToSave] = useState(false);
    const [quizzesToSave, setQuizzesToSave] = useState<Quiz[]>([]);
    const [quizTitle, setQuizTitle] = useState('');
    const navigate = useNavigate();

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
        const updatedQuizzes = [...storedQuizzes, newQuiz];
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        handleModalClose();
        navigate('/teacher/dashboard');
    };



    /*
    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContents = (e.target as FileReader).result as string;
            setValue(fileContents);
            handleUpdatePreview(); // Update the preview with the dropped quiz content
          };
          reader.readAsText(file);
        }
    };
    */



    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    
        const files = event.dataTransfer.files;
        if (files.length > 0) {
          Array.from(files).forEach((file) => {
            if (file.type === 'text/plain') {
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = (e) => {
                const fileContents = (e.target as FileReader).result as string;
                setQuizzesToSave((prevQuizzes) => [
                  ...prevQuizzes,
                  { id: uuidv4(), title: '', questions: fileContents },
                ]);
              };
            }
            return null;
          });
        }
    };


    const handleSaveQuizzes = () => {
        // Les quiz sont enregistres un par en par edition de nom par l'utilisateur
        const updatedQuizzes = quizzesToSave.map((quiz) => ({
          ...quiz,
          title: quiz.title || 'Quiz sans nom',
        }));
    
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzesToSave([]);
        navigate('/teacher/dashboard');
     };



    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContents = (e.target as FileReader).result as string;
            setValue(fileContents);
            // Met a jour le preview avec le contenu du quiz charge
            handleUpdatePreview(); 
          };
          reader.readAsText(file);
        }
    };







    return (
        <div>

            <div className="drop-zone" onDrop={handleFileDrop} onDragOver={(event) => event.preventDefault()}>
                <p>Glisser un quiz pré-enregistré en format .txt ou ecrivez un nouveau quiz</p>
            </div>
            
            <input type="file" accept=".txt" onChange={handleFileChange} style={{ display: 'none' }} />

            {quizzesToSave.length > 0 && (
                <Modal title="Sauvegarder les quiz" message="Entrez un titre pour chaque quiz:"
                hasOptionalInput optionalInputValue={quizTitle} onOptionalInputChange={(event) => setQuizTitle(event.target.value)}
                onConfirm={handleSaveQuizzes} onCancel={handleModalClose}/>
            )}



            








            <div id="editor-preview-container" className="container">
                <div className="editor-column">
                    <Editor initialValue="" onEditorChange={handleEditorChange} />
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

export default CreateQuiz;
