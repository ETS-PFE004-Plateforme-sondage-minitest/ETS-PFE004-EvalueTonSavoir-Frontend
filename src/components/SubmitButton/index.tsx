import React from 'react';
import './style.css';

interface Props {
    onClick: () => void;
    hide?: boolean;
    disabled: boolean;
}

const SubmitButton: React.FC<Props> = (props) => {
    const { hide, onClick, disabled } = props;
    if (hide) {
        return null;
    }
    return (
        <button className="submit-button" onClick={onClick} disabled={disabled}>
            Répondre
        </button>
    );
};

export default SubmitButton;
