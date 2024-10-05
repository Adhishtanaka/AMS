import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Auction {
    auctionId: number;
    carTitle: string;
    currentPrice: number;
}

const ActiveAuctions: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);

    useEffect(() => {
        axios.get('/api/Buyer/GetActiveAuctions')
            .then(response => setAuctions(response.data))
            .catch(error => console.error('Error fetching auctions:', error));
    }, []);

    return (
        <div>
            <h2>Active Auctions</h2>
            <ul>
                {auctions.map(auction => (
                    <li key={auction.auctionId}>
                        {auction.carTitle} - {auction.currentPrice}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveAuctions;