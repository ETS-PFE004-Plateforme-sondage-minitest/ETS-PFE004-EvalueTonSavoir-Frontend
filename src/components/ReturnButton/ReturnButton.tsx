// GoBackButton.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { Button } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

interface Props {
    onReturn?: () => void;
    askConfirm?: boolean;
    message?: string;
}

const ReturnButton: React.FC<Props> = ({
    askConfirm = false,
    message = 'Êtes-vous sûr de vouloir quitter la page ?',
    onReturn
}) => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    const handleOnReturnButtonClick = () => {
        if (askConfirm) {
            setShowDialog(true);
        } else {
            handleOnReturn();
        }
    };

    const handleConfirm = () => {
        setShowDialog(false);
        handleOnReturn();
    };

    const handleOnReturn = () => {
        if (!!onReturn) {
            onReturn();
        } else {
            navigate(-1);
        }
    };

    return (
        <div>
            <Button
                variant="text"
                startIcon={<ChevronLeft />}
                onClick={handleOnReturnButtonClick}
                color="primary"
                sx={{ marginLeft: '-0.5rem', fontSize: 16 }}
            >
                Retour
            </Button>
            <ConfirmDialog
                open={showDialog}
                title="Confirmer"
                message={message}
                onConfirm={handleConfirm}
                onCancel={() => setShowDialog(false)}
                buttonOrderType="warning"
            />
        </div>
    );
};

export default ReturnButton;
