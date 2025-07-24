import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import MovieDetail from './components/MovieDetail';
import './app.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path='/movieDetail/:id' element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
