import React from 'react';
import './modal.css';

type ModalProps = {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    hasOptionalInput?: boolean;
    optionalInputValue?: string;
    onOptionalInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Modal: React.FC<ModalProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    hasOptionalInput,
    optionalInputValue,
    onOptionalInputChange
}) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                {hasOptionalInput && (
                    <div className="modal-optional-input">
                        <input
                            type="text"
                            id="optional-input"
                            value={optionalInputValue || ''}
                            onChange={onOptionalInputChange}
                        />
                    </div>
                )}
                <div className="modal-buttons">
                    <button className="modal-confirm" onClick={onConfirm}>
                        Confirmer
                    </button>
                    <button className="modal-cancel" onClick={onCancel}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
