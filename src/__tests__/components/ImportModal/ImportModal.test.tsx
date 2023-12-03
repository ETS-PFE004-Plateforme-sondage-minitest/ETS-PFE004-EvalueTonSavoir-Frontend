import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DragAndDrop from '../../../components/ImportModal/ImportModal';

describe('DragAndDrop Component', () => {
  test('renders without crashing', () => {
    render(
      <DragAndDrop
        handleOnClose={() => {}}
        handleOnImport={() => {}}
        open={true}
      />
    );

    expect(screen.getByText('Importation de quiz')).toBeInTheDocument();
  });

  test('handles drag and drop', () => {
    const handleOnCloseMock = jest.fn();
    const handleOnImportMock = jest.fn();

    render(
      <DragAndDrop
        handleOnClose={handleOnCloseMock}
        handleOnImport={handleOnImportMock}
        open={true}
      />
    );

    const dropZone = screen.getByText(/Déposer des fichiers ici/i);
    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer: { files: [new File([''], 'sample.txt')] } });

    expect(screen.getByText('📄')).toBeInTheDocument();
    expect(screen.getByText('sample.txt')).toBeInTheDocument();
  });


});
