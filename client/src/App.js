import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Title } from './components/Title.js';
import { Menu } from './components/Menu.js'
import { Cart } from './components/Cart.js'
import { Purchases } from './components/Purchases.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Title/>
        <Routes>
          <Route path='/' element={<Menu/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/purchases' element={<Purchases/>}/>
          <Route path='*' element={<Menu/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
