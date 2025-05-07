import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCreate.css';

export function ProductCreate () {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function updateName(e) { setName(e.target.value) }
    function updatePrice(e) { e.target.value>0 ? setPrice(e.target.value) : setPrice(0) }
    function updateDescription(e) { setDescription(e.target.value) }

    async function onSubmit(e) {
        e.preventDefault();

        if (name === "") {
            setErrorMessage("Campo nome não preenchido.");
            return;
        }

        if (Number(price) < 1) {
            setErrorMessage("O valor do produto deve ser maior que zero.");
            return;
        }

        setErrorMessage("");

        try {

            const response = await fetch('http://localhost:4004/productscreate', 
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, price, description }),
            });

            if (!response.ok) {
                throw new Error("Ocorreu um erro ao criar o produto:", response.status);
            }

            setName('');
            setPrice('');
            setDescription('');
        }catch (error){
            setErrorMessage('Servico indisponivel no momento! Tente novamente mais tarde.')
            console.error("Erro ao enviar o formulario:", error);
        }
    }

    return (
        <div className="product-create">
            {errorMessage && (
                <div className="errorMessage">Um erro ocorreu {errorMessage}</div>
            )}
            <h2>Criar novo produto:</h2>
            <form onSubmit={onSubmit}>
                <label >Nome do Produto:</label>
                <input className="name" type="text" onChange={updateName} value={name}/>
                <label>Preco do Produto:</label>
                <input className="price" type="number" onChange={updatePrice} value={price}/>
                <label>Descricao do Produto:</label>
                <textarea className="description" type="text" onChange={updateDescription} value={description}></textarea>
                <button type="submit">Criar produto</button>
            </form>
        </div>
    );
}