import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Bid {
    bidId: number;
    userId: number;
    userName: string;
    bidTime: string;
    amount: number;
}

interface BidHistoryProps {
    auctionId: number;
}

const BidHistory: React.FC<BidHistoryProps> = ({ auctionId }) => {
    const [bidHistory, setBidHistory] = useState<Bid[]>([]);

    useEffect(() => {
        axios.get(`/api/Buyer/GetBidHistory?auctionId=${auctionId}`)
            .then(response => setBidHistory(response.data))
            .catch(error => console.error('Error fetching bid history:', error));
    }, [auctionId]);

    return (
        <div>
            <h2>Bid History</h2>
            <ul>
                {bidHistory.map(bid => (
                    <li key={bid.bidId}>
                        {bid.userName} - {bid.amount} - {new Date(bid.bidTime).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BidHistory;