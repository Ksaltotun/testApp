import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {ThermistorChain} from './pages/ThermistorChain'
import { DeformationControl } from './pages/DeformationControl';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
            <Route index element={<div>Welcome!</div> } />
            <Route path="deformationcontrol" element={<DeformationControl />} />
            <Route path="thermistorchain" element={<ThermistorChain />} />
          </Route>
      </Routes>
    </BrowserRouter>
);

