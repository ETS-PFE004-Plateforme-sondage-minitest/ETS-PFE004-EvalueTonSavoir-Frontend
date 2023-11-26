import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Props {
    previousQuestion: () => void;
    nextQuestion: () => void;
    currentQuestionId: number;
    questionsLength: number;
}
const QuestionNavigation: React.FC<Props> = ({
    previousQuestion,
    nextQuestion,
    currentQuestionId,
    questionsLength
}) => {
    return (
        <div className="center-h-align">
            <IconButton
                onClick={previousQuestion}
                disabled={currentQuestionId <= 1}
                color="primary"
            >
                <ChevronLeft />
            </IconButton>
            <div className="text-lg text-bold">{`Question ${currentQuestionId}/${questionsLength}`}</div>
            <IconButton
                onClick={nextQuestion}
                disabled={currentQuestionId >= questionsLength}
                color="primary"
            >
                <ChevronRight />
            </IconButton>
        </div>
    );
};

export default QuestionNavigation;
