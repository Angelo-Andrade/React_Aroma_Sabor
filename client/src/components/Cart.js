import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export function Cart() {
    const navigate = useNavigate();
    const [cart, updateCart] = useState({ order:{} });
    const [cartId, setCartId] = useState(localStorage.getItem('cartId'));

    console.log(cartId);
    async function fetchCart() {
        try {
            
            const response = await fetch(`http://localhost:4001/cart/${cartId}`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar o carrinho: ${response.status}`);
            }
            
            const cartData = await response.json();
            updateCart(cartData);
        } catch (error) {
            updateCart(null);
            console.error('Erro ao buscar o carrinho:', error);
        }
    }

    async function removeProduct(e, productId) {
        try {
            const response = await fetch('http://localhost:4001/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": cart.id,
                    "productId": productId
                })
            });
            
            const newCart = await response.json();
            
            updateCart(newCart);
        } catch (error) {
            console.error('Houve um erro ao remover o produto:', error);
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4001/cart/finalize', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart })
            });

            if(!response.ok) throw new Error('Erro ao requisitar historico de compras: ', response.status);
            
            navigate('/purchases');
        }
        catch(error) {
            console.log('Ocorreu um erro: ', error)
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    if (!cart) {
        return (
            <div className='errorMessage'>
                <p>&#128551;</p>
                <h2>Houve um erro ao consultar o carrinho. Volte mais tarde.</h2>
            </div>
        );
    }


    if (cart.message === 'Carrinho não encontrado' || Object.keys(cart.order).length === 0) {
        // console.log(localStorage.getItem('cartId'));
        localStorage.removeItem('cartId');
        return (
            <div className='errorMessage'>
                <p>&#128517;</p>
                <h2>Carrinho vazio, volte para a tela inicial e boas compras!</h2>
            </div>
        );
    }

    const renderedCart = Object.values(cart.order).map((item) => {
        return (
            <tr key={item.productId} name='productId'>
                <td name='productName'>{item.productName}</td>
                <td name='productPrice'>{item.productPrice}</td>
                <td name='productAmount'>{item.amount}</td>
                <td><button type='button' onClick={(e) => removeProduct(e, item.productId)}>Remover produto</button></td>
            </tr>
        );
    });

    return (
        <div>
            <h2>Resumo do Pedido #{cart.id}</h2>
            <form onSubmit={onSubmit}>

                <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedCart}
                    </tbody>
                </table>

                <p>Confira o pedido e clique em finalizar para concretizar o pedido</p>
                <button type='submit'>Finalizar</button>
            </form>
        </div>
    );
}
