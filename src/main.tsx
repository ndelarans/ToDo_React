import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que la ruta sea correcta
import './index.css'; // Importa tu archivo CSS global si tienes uno

const rootElement = document.getElementById('root'); // Asegúrate de que tu HTML tenga un elemento con este ID
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
