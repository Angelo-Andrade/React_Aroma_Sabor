import { NavLink } from "react-router-dom";
import './Title.css';

export function Title() {
    return (
        <div className="title">
            <NavLink to='/'>
                <button>Menu</button>
            </NavLink>
            <NavLink to='/cart'>
                <button>Carrinho</button>
            </NavLink>
            <NavLink to='/purchases'>
                <button>Pedidos</button>
            </NavLink>
        
        </div>
    );
}
