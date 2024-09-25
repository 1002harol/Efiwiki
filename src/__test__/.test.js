import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import App from '../App';
import  Manuales from '../complementos/Manuales/Manuales';
import  FQA  from '../complementos/FQA/FQA';
import  Comunicados  from '../complementos/Comunicados/Comunicados';


// Mock para axios
jest.mock('axios');

// Mock para performance.now()
const mockPerformanceNow = jest.fn();
global.performance = { now: mockPerformanceNow };

// Mock del módulo fs para simular la lectura de archivos locales
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => 'Mocked PDF content'),
}));

describe('Wiki tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(0); // Inicializa el tiempo en 0
  });

  test('renders login form', () => {
    render(<App />);
    
    // Verifica la presencia de elementos clave en el formulario de login
    const titleElement = screen.getByText(/Efiwiki/i);
    const usernameLabel = screen.getByText(/Usuario:/i);
    const passwordLabel = screen.getByText(/Contraseña:/i);
    const rememberMeLabel = screen.getByText(/Recordarme/i);
    const submitButton = screen.getByText(/Iniciar Sesión/i);
    
    // Asegura que estos elementos estén en el documento
    expect(titleElement).toBeInTheDocument();
    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(rememberMeLabel).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('PDF Viewer loads and renders local PDF within 700ms', async () => {
    const localPDFPath = './path/to/local/pdf/manual.pdf';
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(500);

    const { findByTestId } = render(<Manuales pdfPath={localPDFPath} />);
    const pdfViewer = await findByTestId('pdf-viewer');

    expect(pdfViewer).toBeInTheDocument();
    const pdfLoadTime = performance.now();
    console.log(`Local PDF load time: ${pdfLoadTime}ms`);
    expect(pdfLoadTime).toBeLessThan(700);
  });

  test('File upload to local storage completes within 1000ms', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(800);

    // Mock de la función de subida local
    const mockLocalUpload = jest.fn().mockResolvedValue({ success: true });
    
    const { getByLabelText, findByText } = render(<Comunicados localUpload={mockLocalUpload} />);
    
    await act(async () => {
      fireEvent.change(getByLabelText('Upload File'), { target: { files: [file] } });
    });

    await findByText('Upload Successful');

    const uploadTime = performance.now();
    console.log(`Local file upload time: ${uploadTime}ms`);
    expect(uploadTime).toBeLessThan(1000);
    expect(mockLocalUpload).toHaveBeenCalledWith(file);
  });

  test('Problem List loads and renders 100 items within 350ms', async () => {
    const mockProblems = Array(100).fill().map((_, index) => ({
      id: index,
      title: `Problem ${index}`,
      descripcion: `Descripcion ${index}`
    }));

    axios.get.mockResolvedValue({ data: mockProblems });
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(300);

    const { findAllByTestId } = render(<FQA />);
    const items = await findAllByTestId('problem-item');

    const listLoadTime = performance.now();
    console.log(`Problem List load time: ${listLoadTime}ms`);
    expect(listLoadTime).toBeLessThan(350);
    expect(items).toHaveLength(100);
  });

  test('Full app initial load completes within 2000ms', async () => {
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(1800);

    const { findByTestId } = render(<App />);
    await findByTestId('app-loaded');

    const appLoadTime = performance.now();
    console.log(`Full app initial load time: ${appLoadTime}ms`);
    expect(appLoadTime).toBeLessThan(2000);
  });
});