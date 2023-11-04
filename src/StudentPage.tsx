import { GIFTQuestion, parse } from 'gift-pegjs'
import TrueFalseQuestion from './components/Questions/TrueFalseQuestion'
import MultipleChoiceQuestion from './components/Questions/MultipleChoiceQuestion'
import NumericalQuestion from './components/Questions/NumericalQuestion'
import ShortAnswerQuestion from './components/Questions/ShortAnswerQuestion'
import { useMemo, useState } from 'react'

const App = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState(0)
  const [showAnswers, setShowAnswers] = useState(true)
  const [quizString, setQuizString] = useState(`
  Is this True? {T}.
  
  Repond a cette question {F}.

  Mahatma Gandhi's birthday is an Indian holiday on {
  ~15th
  ~3rd
  =2nd
  } of October.
  
  Since {
    ~495 AD
    =1066 AD
    =1215 AD
    ~ 43 AD
  } the town of Hastings England has been "famous with visitors".
  
  What is the value of pi (to 3 decimal places)? {#3.141..3.142}.

  C'est quoi mon nom? {=Mihai =Mihay}.
`)
  const quiz: GIFTQuestion[] = parse(quizString)

  const handleOnSubmitAnswer = (answer: string | number | boolean) => {
    console.log(`Sending answer to teacher server: ${answer}`)
  }

  const questions = useMemo(
    () =>
      quiz.map((question) => {
        switch (question.type) {
          case 'TF':
            return (
              <TrueFalseQuestion
                key={question.type + question.stem.text}
                questionTitle={question.stem.text}
                correctAnswer={question.isTrue}
                handleOnSubmitAnswer={handleOnSubmitAnswer}
                showAnswer={showAnswers}
              />
            )
          case 'MC':
            return (
              <MultipleChoiceQuestion
                key={question.type + question.stem.text}
                questionTitle={question.stem.text}
                choices={question.choices}
                handleOnSubmitAnswer={handleOnSubmitAnswer}
                showAnswers={showAnswers}
              />
            )
          case 'Numerical':
            if (!!question.choices && !Array.isArray(question.choices)) {
              return (
                <NumericalQuestion
                  key={question.type + question.stem.text}
                  questionTitle={question.stem.text}
                  correctAnswers={question.choices}
                  handleOnSubmitAnswer={handleOnSubmitAnswer}
                  showAnswers={showAnswers}
                />
              )
            }
            break
          case 'Short':
            return (
              <ShortAnswerQuestion
                key={question.type + question.stem.text}
                questionTitle={question.stem.text}
                choices={question.choices}
                handleOnSubmitAnswer={handleOnSubmitAnswer}
                showAnswers={showAnswers}
              />
            )
        }
      }),
    [quiz]
  )
  return (
    <>
      {questions[currentQuestionId]}
      <button onClick={() => setCurrentQuestionId(currentQuestionId + 1)}>Next question</button>
    </>
  )
}

export default App
