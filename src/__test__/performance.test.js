import { performance } from 'perf_hooks';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import App from '../App'; // Ajusta la ruta según tu estructura
import { Manuales } from '../complementos/Manuales/Manuales.js';
import { FQA } from '../complementos/FQA/FQA.js';
import { Comunicados } from '../complementos/Comunicados/Comunicados.js';
import { Login } from '../Login/Login';
import { NotificationTray } from '../complementos/NotificationTray/NotificationTray';

jest.mock('axios');

describe('Wiki App Performance Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login renders and submits within 200ms', async () => {
    const startTime = performance.now();
    const { getByLabelText, getByText } = render(<Login />);
    
    await act(async () => {
      fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
      fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
      fireEvent.click(getByText('Login'));
    });

    const endTime = performance.now();
    const loginTime = endTime - startTime;
    
    console.log(`Login time: ${loginTime}ms`);
    expect(loginTime).toBeLessThan(200);
  });

  test('PDF Viewer loads and renders within 500ms', async () => {
    const mockPDFUrl = 'http://example.com/test.pdf';
    const startTime = performance.now();
    
    const { findByTestId } = render(<Manuales url={mockPDFUrl} />);
    await findByTestId('pdf-viewer');

    const endTime = performance.now();
    const pdfLoadTime = endTime - startTime;
    
    console.log(`PDF load time: ${pdfLoadTime}ms`);
    expect(pdfLoadTime).toBeLessThan(500);
  });

  test('Problem List loads and renders 100 items within 300ms', async () => {
    const mockProblems = Array(100).fill().map((_, index) => ({
      id: index,
      title: `Problem ${index}`,
      description: `Description ${index}`
    }));

    axios.get.mockResolvedValue({ data: mockProblems });

    const startTime = performance.now();
    
    const { findAllByTestId } = render(<FQA/>);
    const items = await findAllByTestId('problem-item');

    const endTime = performance.now();
    const listLoadTime = endTime - startTime;
    
    console.log(`Problem List load time: ${listLoadTime}ms`);
    expect(listLoadTime).toBeLessThan(300);
    expect(items).toHaveLength(100);
  });

  test('File upload completes within 1000ms', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const startTime = performance.now();
    
    const { getByLabelText, findByText } = render(<Comunicados />);
    
    await act(async () => {
      fireEvent.change(getByLabelText('Upload File'), { target: { files: [file] } });
    });

    await findByText('Upload Successful');

    const endTime = performance.now();
    const uploadTime = endTime - startTime;
    
    console.log(`File upload time: ${uploadTime}ms`);
    expect(uploadTime).toBeLessThan(1000);
  });

  test('Notification Center loads and displays notifications within 150ms', async () => {
    const mockNotifications = Array(10).fill().map((_, index) => ({
      id: index,
      message: `Notification ${index}`
    }));

    axios.get.mockResolvedValue({ data: mockNotifications });

    const startTime = performance.now();
    
    const { findAllByTestId } = render(<NotificationTray/>);
    const notifications = await findAllByTestId('notification-item');

    const endTime = performance.now();
    const notificationLoadTime = endTime - startTime;
    
    console.log(`Notification Center load time: ${notificationLoadTime}ms`);
    expect(notificationLoadTime).toBeLessThan(150);
    expect(notifications).toHaveLength(10);
  });

  test('Full app initial load completes within 2000ms', async () => {
    const startTime = performance.now();
    
    const { findByTestId } = render(<App />);
    await findByTestId('app-loaded');

    const endTime = performance.now();
    const appLoadTime = endTime - startTime;
    
    console.log(`Full app initial load time: ${appLoadTime}ms`);
    expect(appLoadTime).toBeLessThan(2000);
  });
});