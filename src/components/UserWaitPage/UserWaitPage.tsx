import { Button, Chip, Grid } from '@mui/material';
import { UserType } from '../../Types/UserType';
import { PlayArrow } from '@mui/icons-material';
import LaunchQuizDialog from '../LaunchQuizDialog/LaunchQuizDialog';
import { useState } from 'react';
import './userWaitPage.css';

interface Props {
    users: UserType[];
    launchQuiz: () => void;
    roomName: string;
    setQuizMode: (mode: 'student' | 'teacher') => void;
}

const UserWaitPage: React.FC<Props> = ({ users, launchQuiz, roomName, setQuizMode }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <div className="wait">
            <div className='button'>
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

            <div className="students">
               
                <Grid container spacing={3}>

                    {users.map((user, index) => (
                        <Grid item key={user.name + index}>
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
