import React, { useState } from 'react';
import axios from 'axios';

interface Bid {
    aucId: number;
    amount: number;
}

const PlaceBid: React.FC = () => {
    const [bid, setBid] = useState<Bid>({ aucId: 0, amount: 0 });
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBid({ ...bid, [name]: Number(value) });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('/api/Buyer/PlaceBid', bid)
            .then(response => setMessage(response.data.message))
            .catch(() => setMessage('Error placing bid.'));
    };

    return (
        <div>
            <h2>Place Bid</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" name="aucId" placeholder="Auction ID" value={bid.aucId} onChange={handleChange} required />
                <input type="number" name="amount" placeholder="Bid Amount" value={bid.amount} onChange={handleChange} required />
                <button type="submit">Place Bid</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PlaceBid;