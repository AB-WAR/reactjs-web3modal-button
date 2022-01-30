import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/home";


function App() {
  return (
    <div>
        <ToastContainer role="alert" />
        <Home />
    </div>
  );
}

export default App;
