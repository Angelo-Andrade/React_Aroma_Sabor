import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCreate } from './ProductCreate.js';
import './ProductList.css';

export function ProductsList ( ) {
    const [products, setProducts] = useState({});
    const [order, setAmounts] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function updateAmout(e, id, productName, productPrice) {    
      if (e.target.value > 0 && e.target.value < 10) {
        setAmounts(prevOrder => ({
          ...prevOrder,
          [id]: {
            productId: id,
            amount: e.target.value,
            productName: productName,
            productPrice: productPrice
          }
        }));
      }
      else {
        const newOrder = { ...order }
        delete newOrder[id];
        setAmounts(newOrder);  
        console.log(newOrder);
      }
    }
    
    function increaseAmout(e, id, productName, productPrice) {
      setAmounts(prevOrder => {
        const currentAmount = Number(prevOrder[id]?.amount || 0);
    
        if (currentAmount >= 9) return prevOrder;
    
        return {
          ...prevOrder,
          [id]: {
            productId: id,
            amount: currentAmount + 1,
            productName: productName,
            productPrice: productPrice
          }
        };
      });
    }
    
    async function checkLocalStorage () {
      const existingCartId = localStorage.getItem('cartId');  
      if (existingCartId) {
        const reuse = window.confirm(
          'Você já possui um carrinho em andamento. Deseja continuar com ele?'
        );

        return reuse;
      }
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:4000/products');
        const data = await res.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (error) {
        setProducts(undefined);
        console.error('Error fetching products:', error);
      }
    }

    async function onSubmit(e, order) {
      e.preventDefault();

      const answer = await checkLocalStorage();
      
      if (answer) return navigate('/cart');
      else localStorage.removeItem('cartId');
      
      try {
        if (!Object.values(order).some(item => Number(item.amount) > 0)) {
          setErrorMessage("Quantidade invalida de produtos!");
          return;
        }        

        const response = await fetch('http://localhost:4000/products/createcart', 
        {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(
            { 
              order
            })
        });

        if (!response.ok) throw new Error("Ocorreu um erro ao adicionar o produto no carrinho:", response.status);

        const data = await response.json();
        localStorage.setItem('cartId', data.id);
        setErrorMessage('');
        navigate('/cart');
      }catch (error) {
        setErrorMessage("Nao foi possivel criar o carrinho de compras! Tente novamente mais tarde.");
        console.error("Erro ao enviar formulario: ", error);
      }
      
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    if (!products) {
      return (
        <div className='errorMessage'>
          <p>&#128533;</p>
          <h2>
            Estamos temporariamente fora do ar. O site está passando por uma manutenção ou enfrentando instabilidades no momento.
            Pedimos desculpas pelo transtorno. Por favor, tente novamente em alguns minutos.
          </h2>
        </div>
      );
    } else if (Object.keys(products).length === 0) {
      return (
        <>
          <div className='errorMessage'>
            <p>&#128517;</p>
            <h2>
              Nenhum produto no catalogo!
              Preencha o formulario abaixo e pressione 'criar produto' para adicionar novos produtos.
            </h2>
          </div>
          <ProductCreate/>
        </>
      );
    }

    const renderedProducts = Object.values(products).map((products) => {
      return (
        <div className="product" key={products.id}>
          <h3>- {products.name}</h3>
          <div>
            <p>
              - Preco: <strong>{products.price}</strong>
            </p>
            <p>
              - Descricao: <strong>{products.description}</strong>
            </p>
          </div>
          <label>Quantidade: </label>
          <input name="amount" type='number' value={order[products.id] ? order[products.id].amount : 0} onChange={(e) => updateAmout(e, products.id, products.name, products.price)}/>
          <button type='button' onClick={(e) => increaseAmout(e, products.id, products.name, products.price)}>Comprar</button>
        </div>
      );
    });

    return (
        <div>
          <form onSubmit={(e) => onSubmit(e, order)}>
            <div className='products-list'>
              {renderedProducts}
            </div>
            <button className='cart-button' type='submit'>Colocar produtos no carrinho</button>
          </form>
          {errorMessage && (
                <div className="errorMessage">Um erro ocorreu: {errorMessage}</div>
          )}
          <ProductCreate/>
        </div>
    );
}