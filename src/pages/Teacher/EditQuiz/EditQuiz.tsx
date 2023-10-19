import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import { parse as GIFTParse } from 'gift-pegjs';

import Editor from '../../../components/EditorPreview/Editor';
import Preview from '../../../components/EditorPreview/Preview';

import '../../../components/EditorPreview/EditorPreview.css';

interface Quiz {
  id: string;
  title: string;
  questions: string;
}

interface EditQuizParams {
  id: string;
  [key: string]: string | undefined;
}

const EditQuiz: React.FC = () => {
  const { id } = useParams<EditQuizParams>();
  const [value, setValue] = useState('');
  const [previewValue, setPreviewValue] = useState('');
  const [quizToSave, setQuizToSave] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quiz from local storage
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const quizToEdit = storedQuizzes.find((q: Quiz) => q.id === id);
    if (quizToEdit) {
      setQuiz(quizToEdit);
      setValue(quizToEdit.questions);
      setPreviewValue(quizToEdit.questions);
      setQuizTitle(quizToEdit.title);
    }
  }, [id]);

  function handleEditorChange(value: string) {
    setValue(value);
  }

  function handleUpdatePreview() {
    setPreviewValue(value);
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
    const updatedQuizzes = storedQuizzes.map((q: Quiz) => {
      if (q.id === id) {
        return { ...q, title: quizTitle, questions: value };
      }
      return q;
    });
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    alert('Quiz saved!');
    handleModalClose();
    navigate('/teacher/dashboard');
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div id='editor-preview-container' className="container">
        <div className='editor-column'>
          <Editor initialValue={quiz.questions} onEditorChange={handleEditorChange} />
          <div className='quiz-action-buttons'>
            <a onClick={handleUpdatePreview}>Prévisualisation</a>
            <a onClick={handleParse}>Parse</a>
            <a onClick={handleSaveQuiz}>Enregistrer</a>
          </div>
        </div>
        <div className='preview-column'>
          <Preview questions={previewValue} />
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

export default EditQuiz;