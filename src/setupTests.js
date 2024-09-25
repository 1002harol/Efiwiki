import '@testing-library/jest-dom';
import 'jest';

process.env.REACT_APP_API_URL = 'https://172.26.4.29:3000/efiWiki';
process.env.REACT_APP_API_AUTH = 'U4nRc8f1ufB_n.qbUNss';
process.env.REACT_APP_API_AUTHORIZATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZWZpd2lraSIsInN1YiI6MTQsImlhdCI6MTcyMTMxMDk0OH0.xA1S-vojRFzcTbFHVJJFAT15xXX497eHazQKTagP48g';// Mocks globales

jest.mock('axios');
jest.mock('react-modal');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));


jest.mock('react-toastify', () => ({
  toast: jest.fn(),
  ToastContainer: () => <div/>, // Renderiza el contenedor como un div
}));



 global.console = {
    ...console,
    error:jest.fn(),
    warn:jest.fn(),
    log:jest.fn(),
 }
 