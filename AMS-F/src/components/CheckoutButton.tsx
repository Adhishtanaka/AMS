import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../util/api";
import { handleErrorResult, handleSuccessResult } from "../util/TostMessage";

const stripePromise = loadStripe(
  "pk_test_51QCVAuDAraHYuRgNfNyoH2FjuXGaMy3MsxYNGhVqcLVurtKCqB7y11e9GXTHsY7y5IMstldHbBr1bJWuMoQJiXNh00sxJRCt23"
);

interface CheckoutButtonProps {
  auc_id:number;
}
const CheckoutButton: React.FC<CheckoutButtonProps> = ({ auc_id }) => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    try {
      const response = await api.post("/payment/create-checkout-session", {
        auc_id
      });

      const { sessionId } = response.data;

      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        handleErrorResult("chekcout failed");
      } else {
        handleSuccessResult("Checkout in progress");
      }
    } catch (error) {
      handleErrorResult("chekcout failed");
    }
  };

  return (
    <button
      role="link"
      className="px-6 py-2 w-full bg-[#2b2b72] hover:bg-[#2b2b68] text-white font-semibold rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 active:scale-95"
    onClick={handleClick}>
      Checkout
    </button>
  );
};

export default CheckoutButton;
