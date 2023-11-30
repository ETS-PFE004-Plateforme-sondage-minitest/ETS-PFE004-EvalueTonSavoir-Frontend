import { Button, Chip, Grid } from '@mui/material';
import { UserType } from '../../Types/UserType';
import { PlayArrow } from '@mui/icons-material';
import LaunchQuizDialog from '../LaunchQuizDialog/LaunchQuizDialog';
import { useMemo, useState } from 'react';

interface Props {
    users: UserType[];
    launchQuiz: () => void;
    roomName: string;
    setQuizMode: (mode: 'student' | 'teacher') => void;
}

const UserWaitPage: React.FC<Props> = ({ users, launchQuiz, roomName, setQuizMode }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const gridXS = useMemo(() => {
        let size = 2;
        if (users.length <= 2) {
            size = 8;
        } else if (users.length <= 3) {
            size = 6;
        } else if (users.length <= 6) {
            size = 4;
        } else if (users.length < 12) {
            size = 3;
        }
        return size;
    }, [users]);

    return (
        <div className="manage-room-container">
            <div className="end-h-align w-full">
                <div className="title text-bold selectable-text">Salle: {roomName}</div>
                <div>
                    <Button
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<PlayArrow />}
                        fullWidth
                        sx={{ fontWeight: 600, fontSize: 20 }}
                    >
                        Lancer
                    </Button>
                </div>
            </div>
            <div className="quiz-setup-container">
                <div className="text-xl text-bold mb-1">{`Utilisateurs: (${users.length}/60)`}</div>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        overflowY: 'auto',
                        height: '60vh',
                        width: '100%',
                        paddingRight: '1rem',
                        paddingTop: '1rem'
                    }}
                >
                    {users.map((user, index) => (
                        <Grid item key={user.name + index} xs={gridXS}>
                            <Chip label={user.name} sx={{ width: '100%' }} />
                        </Grid>
                    ))}
                </Grid>
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
