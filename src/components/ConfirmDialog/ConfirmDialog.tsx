// Modal.tsx
import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';

type Props = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    hasOptionalInput?: boolean;
    optionalInputValue?: string;
    onOptionalInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    buttonOrderType?: 'normal' | 'warning';
};

const ConfirmDialog: React.FC<Props> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    hasOptionalInput,
    optionalInputValue,
    onOptionalInputChange,
    buttonOrderType = 'normal'
}) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24 }}>{title}</DialogTitle>
            <DialogContentText sx={{ padding: '0 1.5rem 0.5rem 1.5rem' }}>
                {message}
            </DialogContentText>
            {hasOptionalInput && (
                <DialogContent>
                    <TextField
                        id="optional-input"
                        data-testid="optional-input"
                        focused
                        fullWidth
                        value={optionalInputValue || ''}
                        onChange={onOptionalInputChange}
                    />
                </DialogContent>
            )}
            <DialogActions>
                {buttonOrderType === 'normal' && (
                    <Button variant="outlined" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
                <Button
                    variant={buttonOrderType === 'normal' ? 'contained' : 'outlined'}
                    onClick={onConfirm}
                    data-testid="modal-confirm-button"
                >
                    Confirmer
                </Button>
                {buttonOrderType === 'warning' && (
                    <Button variant="contained" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
