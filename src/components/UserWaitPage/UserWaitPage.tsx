import { Button, Chip, Grid } from '@mui/material';
import { UserType } from '../../Types/UserType';
import { PlayArrow } from '@mui/icons-material';
import LaunchQuizDialog from '../LaunchQuizDialog/LaunchQuizDialog';
import { useState } from 'react';

interface Props {
    users: UserType[];
    launchQuiz: () => void;
    roomName: string;
    setQuizMode: (mode: 'student' | 'teacher') => void;
}

const UserWaitPage: React.FC<Props> = ({ users, launchQuiz, roomName, setQuizMode }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    return (
        <div className="manage-room-container">
            <div className="end-h-align w-full">
                <div className="title text-bold selectable-text">Salle : {roomName}</div>
                <div className="text-bold">
                    <Button
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<PlayArrow />}
                        fullWidth
                        sx={{ height: '100%', fontWeight: 800, fontSize: 20 }}
                    >
                        Lancer
                    </Button>
                </div>
            </div>

            <div className="quiz-setup-container">
                <div>
                    <div className="text-xl text-bold mb-1">{`Utilisateurs: (${users.length}/60)`}</div>
                    <Grid container spacing={2} columns={6}>
                        {users.map((user, index) => (
                            <Grid item key={user.name + index} xs={1}>
                                <Chip label={user.name} sx={{ width: '100%' }} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
            <LaunchQuizDialog
                open={isDialogOpen}
                handleOnClose={() => setIsDialogOpen(false)}
                launchQuiz={launchQuiz}
                setQuizMode={setQuizMode}
            />
        </div>
    );
};

export default UserWaitPage;
