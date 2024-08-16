import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Inicio } from './components/Inicio';
import { ListaLibros } from './components/ListaLibros';
import { ListaAutores } from './components/ListaAutores';
import espe from './assets/espe_1.png';

function App() {
  return (
    <Router>
      <Navbar />      
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/libro' element={<ListaLibros />} />
        <Route path='/autor' element={<ListaAutores />} />
      </Routes>
    </Router>
  );
}

export default App;
