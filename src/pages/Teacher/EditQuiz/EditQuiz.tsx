import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useParams, useNavigate } from 'react-router-dom';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
      setQuizTitle(quizToEdit.title);
    }
  }, [id]);

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
    <div id='editor-preview-container' className="container">
      <Editor initialValue={quiz.questions} onUpdatedPreview={handleUpdatePreview} />
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

export default EditQuiz;