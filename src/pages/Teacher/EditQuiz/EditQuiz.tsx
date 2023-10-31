import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { useParams, useNavigate } from 'react-router-dom';

import Editor from '../../../components/EditorPreview/Editor';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

import '../../../components/EditorPreview/EditorPreview.css';
import { QuizType } from '../../../Types/QuizType';
import { QuizService } from '../../../services/QuizService';

interface EditQuizParams {
  id: string;
  [key: string]: string | undefined;
}

const EditQuiz: React.FC = () => {
  const { id } = useParams<EditQuizParams>();
  const [value, setValue] = useState('');
  const [filteredValue, setFilteredValue] = useState<string[]>([]);
  const [quizToSave, setQuizToSave] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quiz from local storage
    const quizToEdit = QuizService.getQuizById(id);
    if (quizToEdit) {
      setQuiz(quizToEdit);
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
    if(linesArray[linesArray.length - 1] === '') linesArray.pop(); // Remove last empty line
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
  
  const confirmQuizEdit = () => {
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedQuizzes = storedQuizzes.map((q: QuizType) => {
      if (q.id === id) {
        return { ...q, title: quizTitle, questions: filteredValue };
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
          <Editor initialValue={value} onEditorChange={handleEditorChange} />
          <div className='quiz-action-buttons'>
            <a onClick={handleUpdatePreview}>Prévisualisation</a>
            <a onClick={handleSaveQuiz}>Enregistrer</a>
          </div>
        </div>
        <div className='preview-column'>
          <GIFTTemplatePreview questions={filteredValue} />
        </div>
      </div>
      {quizToSave && (
        <Modal
          title='Sauvegarder le questionnaire' 
          message='Entrez un titre pour votre questionnaire:'
          hasOptionalInput 
          optionalInputValue={quizTitle}
          onOptionalInputChange={handleQuizTitleChange} 
          onConfirm={confirmQuizEdit} 
          onCancel={handleModalClose} 
        />
      )}
    </div>
  );
};

export default EditQuiz;