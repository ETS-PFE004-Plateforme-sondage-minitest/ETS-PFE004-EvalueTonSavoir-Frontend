import React, { useState } from 'react'
import '../style.css'
import SubmitButton from '../../SubmitButton'

type Choices = {
  feedback: { format: string; text: string } | null
  isCorrect: boolean
  text: { format: string; text: string }
  weigth?: number
}

interface Props {
  questionTitle: string
  choices: Choices[]
  handleOnSubmitAnswer: (answer: string) => void
  showAnswers?: boolean
}

const ShortAnswerQuestion: React.FC<Props> = (props) => {
  const { questionTitle, choices, showAnswers, handleOnSubmitAnswer } = props
  const [answer, setAnswer] = useState<string>()

  return (
    <div className="question-wrapper">
      <div className="title">{questionTitle}</div>
      {showAnswers ? (
        <div className="correct-answer-text">
          {choices.map((choice) => (
            <div>{choice.text.text}</div>
          ))}
        </div>
      ) : (
        <div className="answer-wrapper">
          <input
            type="text"
            id={questionTitle}
            name={questionTitle}
            onChange={(e) => {
              setAnswer(e.target.value)
            }}
            disabled={showAnswers}
          />
        </div>
      )}
      <SubmitButton
        hide={showAnswers}
        onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
        disabled={answer === undefined || answer === ''}
      />
    </div>
  )
}

export default ShortAnswerQuestion
