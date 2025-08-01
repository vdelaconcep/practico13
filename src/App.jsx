import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
