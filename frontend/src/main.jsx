import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import NavBar from './components/NavBar';
import Signin from './pages/Signin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Signin />
    </BrowserRouter>
  </StrictMode>,
);