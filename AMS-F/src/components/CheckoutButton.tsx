import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../util/api';

const stripePromise = loadStripe('pk_test_51QCVAuDAraHYuRgNfNyoH2FjuXGaMy3MsxYNGhVqcLVurtKCqB7y11e9GXTHsY7y5IMstldHbBr1bJWuMoQJiXNh00sxJRCt23');

interface CheckoutButtonProps {
    itemId: string;
    buyerId: string;
    amount: number; 
}
const CheckoutButton: React.FC<CheckoutButtonProps> = ({ itemId, buyerId, amount }) => {
    const handleClick = async () => {
        const stripe = await stripePromise;

        try {
            const response = await api.post('/payment/create-checkout-session', {
                itemId,
                buyerId,
                amount,
            });

            const { sessionId } = response.data;

            // Redirect to Checkout
            const { error } = await stripe!.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Error during redirect to checkout:', error.message);
            } else {
                console.log('Redirection successful!');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return <button role="link" onClick={handleClick}>Checkout</button>;
};

export default CheckoutButton;