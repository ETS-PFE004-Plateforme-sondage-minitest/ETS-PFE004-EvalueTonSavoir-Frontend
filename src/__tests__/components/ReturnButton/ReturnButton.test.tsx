import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReturnButton from '../../../components/ReturnButton/ReturnButton';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

describe('ReturnButton', () => {
    test('navigates back when askConfirm is false', () => {
        const navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);
        render(<ReturnButton askConfirm={false} />);
        fireEvent.click(screen.getByText('Retour'));
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });

    test('shows confirmation modal when askConfirm is true', () => {
        render(<ReturnButton askConfirm={true} />);
        fireEvent.click(screen.getByText('Retour'));
        const confirmButton = screen.getByTestId('modal-confirm-button');
        expect(confirmButton).toBeInTheDocument();
    });

    /*test('navigates back after confirming in the modal', () => {
        const navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);
        render(<ReturnButton askConfirm={true} />);
        fireEvent.click(screen.getByText('Retour'));
        const confirmButton = screen.getByTestId('modal-confirm-button');
        fireEvent.click(confirmButton);
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });*/

    test('cancels navigation when canceling in the modal', () => {
        const navigateMock = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(navigateMock);
        render(<ReturnButton askConfirm={true} />);
        fireEvent.click(screen.getByText('Retour'));
        fireEvent.click(screen.getByText('Annuler'));
        expect(navigateMock).not.toHaveBeenCalled();
    });
});
