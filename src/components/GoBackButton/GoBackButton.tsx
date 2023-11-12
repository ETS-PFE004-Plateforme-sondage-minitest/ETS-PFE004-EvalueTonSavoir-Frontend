import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';

export default function GoBackButton({ askConfirm = false, message = 'Êtes-vous sûr de vouloir quitter la page ?' }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleGoBack = () => {
        if (askConfirm) {
            setShowModal(true);
        } else {
            navigate(-1);
        }
    };

    const handleConfirm = () => {
        setShowModal(false);
        navigate(-1);
    };

    return (
        <>
            <button type="button" onClick={handleGoBack}>Retour</button>
            {showModal && (
                <Modal
                    title="Confirmer"
                    message={message}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    );
}