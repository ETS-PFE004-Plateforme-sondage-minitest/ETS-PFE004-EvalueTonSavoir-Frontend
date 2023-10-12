import React, { useState } from 'react'
import SubmitButton from '../../SubmitButton'
import '../style.css'

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

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
  const { questionTitle, choices, showAnswers, handleOnSubmitAnswer } = props
  const [answer, setAnswer] = useState<string>()

  const handleOnClickAnswer = (choice: string) => {
    setAnswer(choice)
  }

  const alpha = Array.from(Array(26)).map((_e, i) => i + 65)
  const alphabet = alpha.map((x) => String.fromCharCode(x))

  return (
    <div>
      <div className="title">{questionTitle}</div>
      {choices.map((choice, i) => {
        const selected = answer === choice.text.text ? 'selected' : ''
        return (
          <div key={choice.text.text + i}>
            <button
              className="button-wrapper"
              onClick={() => handleOnClickAnswer(choice.text.text)}
              disabled={showAnswers}
            >
              {showAnswers && (choice.isCorrect ? '✅' : '❌')}
              <div className={`circle ${selected}`}>{alphabet[i]}</div>
              <div className={`answer-text ${selected}`}>{choice.text.text}</div>
            </button>
          </div>
        )
      })}
      <SubmitButton
        hide={showAnswers}
        onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
        disabled={answer === undefined}
      />
    </div>
  )
}

export default MultipleChoiceQuestion
