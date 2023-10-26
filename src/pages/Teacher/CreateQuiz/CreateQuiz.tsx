// CreateQuiz.tsx
import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { parse as GIFTParse, GIFTQuestion } from 'gift-pegjs';

import Editor from '../../../components/EditorPreview/Editor';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

import '../../../components/EditorPreview/EditorPreview.css';


const CreateQuiz: React.FC = () => {
  const [value, setValue] = useState('');
  const [parsedValue, setParsedValue] = useState<GIFTQuestion[]>([]);
  const [quizToSave, setQuizToSave] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const navigate = useNavigate();

  function handleEditorChange(value: string) {
    setValue(value);
  }

  function handleUpdatePreview() {
    setParsedValue(GIFTParse(value));
  }

  const handleSaveQuiz = () => {
    setQuizToSave(true);
  };

  const handleQuizTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(event.target.value);
  };

  const handleParse = () => {
    try {
      const parsedValue = GIFTParse(value);
      alert(JSON.stringify(parsedValue, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
      else {
        alert('Unknown error');
      }
    }
  };

  const handleModalClose = () => {
    setQuizToSave(false);
    setQuizTitle('');
  };
  
  const handleQuizSave = () => {
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const newQuiz = { id: uuidv4(), title: quizTitle || 'Untitled quiz', questions: value };
    const updatedQuizzes = [...storedQuizzes, newQuiz];
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    handleModalClose();
    navigate('/teacher/dashboard');
  };

  return (
    <div>
      <div id='editor-preview-container' className="container">
        <div className='editor-column'>
          <Editor initialValue='' onEditorChange={handleEditorChange} />
          <div className='quiz-action-buttons'>
            <a onClick={handleUpdatePreview}>Prévisualisation</a>
            <a onClick={handleParse}>Parse</a>
            <a onClick={handleSaveQuiz}>Enregistrer</a>
          </div>
        </div>
        <div className='preview-column'>
          <GIFTTemplatePreview questions={parsedValue} />
        </div>
      </div>
      {quizToSave && (
        <Modal
          title='Sauvegarder le questionnaire' 
          message='Entrez un titre pour votre questionnaire:' 
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