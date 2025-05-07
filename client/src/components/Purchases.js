import React, { useState, useEffect } from 'react';


export function Purchases () {
    const [purchases, updatePurchases] = useState(undefined);
    async function fetchPurchases() {
        try {
            const response = await fetch(`http://localhost:4002/purchases/`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar pedidos: ${response.status}`);
            }
            
            const data = await response.json();
            updatePurchases(data);
        } catch (error) {
            console.error('Ocorreu um erro: ', error);
            updatePurchases(null);
        }
    }
    
    useEffect(() => {
        fetchPurchases();
    }, []);

    if (!purchases) {
        return (
            <div className='errorMessage'>
                <p>&#128533;</p>
                <h2>
                    Este servico esta temporariamente fora do ar. O site está passando por uma manutenção ou enfrentando instabilidades no momento.
                    Pedimos desculpas pelo transtorno. Por favor, tente novamente em alguns minutos.
                </h2>
            </div>
        );
    }else if (Object.keys(purchases).length === 0) {
        return (
            <div className='errorMessage'>
                <p>&#128517;</p>
                <h2>
                    Nenhum pedido realizado ate o presente momento. Va para o menu e realize a primeira compra!
                </h2>
            </div>
        );
    }

    const renderedPurchase = Object.values(purchases).map((purchase) => {
        const order = Object.values(purchase.order)
        .map(item => `${item.amount}x ${item.productName}`)
        .join('\n');

        const price = Object.values(purchase.order)
        .reduce((sum, item) => sum + item.amount * item.productPrice, 0)
        .toFixed(2);

        return (
            <tr key={purchase.id}>
            <td>{purchase.id}</td>
            <td>{order}</td>
            <td>R$ {price}</td>
            <td>{purchase.date}</td>
            </tr>
        );
    });
    
    return (
        <div>
            <h2>Pedidos:</h2>
            <form>
                <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>ID do Pedido</th>
                            <th>Conteudo</th>
                            <th>Valor total</th>
                            <th>Data do pedido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedPurchase}
                    </tbody>
                </table>
            </form>
        </div>
    );
}