// Editor.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Editor from '../../../components/Editor/Editor';

describe('Editor Component', () => {
    const mockOnEditorChange = jest.fn();

    const sampleProps = {
        initialValue: 'Sample Initial Value',
        onEditorChange: mockOnEditorChange
    };

    beforeEach(() => {
        render(<Editor {...sampleProps} />);
    });

    it('renders correctly with initial value', () => {
        const editorTextarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(editorTextarea).toBeInTheDocument();
        expect(editorTextarea.value).toBe('Sample Initial Value');
    });

    it('calls onEditorChange callback when editor value changes', () => {
        const editorTextarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        fireEvent.change(editorTextarea, { target: { value: 'Updated Value' } });
        expect(mockOnEditorChange).toHaveBeenCalledWith('Updated Value');
    });

    it('updates editor value when initialValue prop changes', () => {
        const updatedProps = {
            initialValue: 'Updated Initial Value',
            onEditorChange: mockOnEditorChange
        };

        render(<Editor {...updatedProps} />);

        const editorTextareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
        const editorTextarea = editorTextareas[1];

        expect(editorTextarea.value).toBe('Updated Initial Value');
    });

    test('should call change text with the correct value on textarea change', () => {
        const updatedProps = {
            initialValue: 'Updated Initial Value',
            onEditorChange: mockOnEditorChange
        };

        render(<Editor {...updatedProps} />);

        const editorTextareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
        const editorTextarea = editorTextareas[1];
        fireEvent.change(editorTextarea, { target: { value: 'New value' } });

        expect(editorTextarea.value).toBe('New value');
    });

    test('should call onEditorChange with an empty string if textarea value is falsy', () => {
        const updatedProps = {
            initialValue: 'Updated Initial Value',
            onEditorChange: mockOnEditorChange
        };

        render(<Editor {...updatedProps} />);

        const editorTextareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
        const editorTextarea = editorTextareas[1];
        fireEvent.change(editorTextarea, { target: { value: '' } });

        expect(editorTextarea.value).toBe('');
    });


});
