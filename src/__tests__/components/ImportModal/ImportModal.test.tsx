import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DragAndDrop from '../../../components/ImportModal/ImportModal';

describe('DragAndDrop Component', () => {

  it('renders without errors', () => {
     const handleOnClose = jest.fn();
     const handleOnImport = jest.fn();
     const open = true;
     render(
       <DragAndDrop
        handleOnClose={handleOnClose}
        handleOnImport={handleOnImport}
        open={open} />
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
  it('handles cancel button correctly', () => {
    const handleOnClose = jest.fn();
    const handleOnImport = jest.fn();
    const open = true;
    const { container } = render(
      <DragAndDrop handleOnClose={handleOnClose} handleOnImport={handleOnImport} open={open} />
    );
    const file = new File(['file content'], 'example.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByText( /cliquez pour ouvrir l'explorateur des fichiers/i), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByText('Annuler'));
    expect(container.querySelector('.file-container')).not.toBeInTheDocument();
  });
  it('handles import correctly', async () => {
    const handleOnCloseMock = jest.fn();
    const handleOnImportMock = jest.fn();
    render(
      <DragAndDrop
        handleOnClose={handleOnCloseMock}
        handleOnImport={handleOnImportMock}
        open={true}
      />
    );
    const file = new File(['file content'], 'example.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByText( /Importer/i), {
      target: { files: [file] },
    });
  });
});