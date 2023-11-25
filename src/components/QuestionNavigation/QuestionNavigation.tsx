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
            <IconButton onClick={previousQuestion} disabled={currentQuestionId <= 1}>
                <ChevronLeft />
            </IconButton>
            <h2 className="page-title">{`Question ${currentQuestionId}/${questionsLength}`}</h2>
            <IconButton onClick={nextQuestion} disabled={currentQuestionId >= questionsLength}>
                <ChevronRight />
            </IconButton>
        </div>
    );
};

export default QuestionNavigation;
