import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from '@mui/material';

interface Props {
    open: boolean;
    handleOnClose: () => void;
    launchQuiz: () => void;
    setQuizMode: (mode: 'teacher' | 'student') => void;
}

const LaunchQuizDialog: React.FC<Props> = ({ open, handleOnClose, launchQuiz, setQuizMode }) => {
    return (
        <Dialog open={open} onClose={handleOnClose}>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24 }}>
                Options de lancement du quiz
            </DialogTitle>
            <DialogContent>
                <FormControl>
                    <FormLabel>Rythme du quiz</FormLabel>
                    <RadioGroup defaultValue="teacher" name="radio-buttons-group">
                        <FormControlLabel
                            value="teacher"
                            control={<Radio />}
                            label="Rythme du professeur"
                            onChange={() => setQuizMode('teacher')}
                        />
                        <FormControlLabel
                            value="student"
                            control={<Radio />}
                            label="Rythme de l'étudiant"
                            onChange={() => setQuizMode('student')}
                        />
                    </RadioGroup>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={handleOnClose}>
                    Annuler
                </Button>
                <Button variant="contained" onClick={launchQuiz}>
                    Lancer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LaunchQuizDialog;
