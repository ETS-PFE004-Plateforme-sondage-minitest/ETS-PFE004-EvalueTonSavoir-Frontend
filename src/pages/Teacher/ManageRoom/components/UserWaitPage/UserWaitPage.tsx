import { Button, Chip, Grid } from '@mui/material';
import { UserType } from '../../../../../Types/UserType';
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
                <div className="text-xl text-bold selectable-text">Salle : {roomName}</div>
                <Button
                    variant="contained"
                    onClick={() => setIsDialogOpen(true)}
                    startIcon={<PlayArrow />}
                >
                    Lancer
                </Button>
            </div>

            <div className="quiz-setup-container">
                <div>
                    <div className="title">{`Utilisateurs: (${users.length}/60)`}</div>
                    <Grid container spacing={2} columns={7}>
                        {users.map((user, index) => (
                            <Grid
                                item
                                key={user.name + index}
                                xs={1}
                                sx={{
                                    marginLeft: `${index % 6 === 0 && index % 12 !== 0 && '100px'}`
                                }}
                            >
                                <Chip label={index + 1} sx={{ width: '100%' }} />
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
