import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../../pages/Home/Home';

describe('Home', () => {
    it('renders Home component with page title and buttons', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByText(/Évalue ton savoir/)).toBeInTheDocument();

        expect(screen.getByText(/Espace\s*étudiant/)).toBeInTheDocument();
        expect(screen.getByText(/Espace\s*enseignant/)).toBeInTheDocument();
    });

    it('navigates to the correct routes when student and teacher buttons are clicked', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const studentButton = screen.getByText(/Espace\s*étudiant/);
        expect(studentButton).toBeInTheDocument();
        fireEvent.click(studentButton);
        expect(window.location.pathname).toBe('/student/join-room');

        const teacherButton = screen.getByText(/Espace\s*enseignant/);
        expect(teacherButton).toBeInTheDocument();
        fireEvent.click(teacherButton);
        expect(window.location.pathname).toBe('/teacher/dashboard');
    });
});