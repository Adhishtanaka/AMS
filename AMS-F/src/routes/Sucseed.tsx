import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import api from '../util/api'; 
import Footer from '../components/Footer'; 
import Navbar from '../components/navbar';  

interface UpdateTransactionResponse {   
    message: string;   
    status: string; 
}

const PaymentSuccess: React.FC = () => {    
    const { auc_id } = useParams<{ auc_id: string }>();   
    const navigate = useNavigate();     
    const [isUpdating, setIsUpdating] = useState<boolean>(true);   
    const [error, setError] = useState<string | null>(null);    

    useEffect(() => {     
        const updateTransaction = async () => {       
            if (auc_id) {
                try {         
                    const response = await api.post<UpdateTransactionResponse>(               
                        '/buyer/updatetransaction',               
                        { AucId: parseInt(auc_id) }            
                    );              
                    console.log('Transaction updated:', response.data);       
                } catch (err: unknown) {         
                    if (axios.isAxiosError(err)) {           
                        console.error('Error updating transaction:', err.response?.data || err.message);           
                        setError(err.response?.data?.message || err.message);         
                    } else {           
                        console.error('Unknown error:', err);           
                        setError('An unknown error occurred');         
                    }       
                } finally {         
                    setIsUpdating(false);       
                } 
            } else {
                setError('No auction ID provided.');
                setIsUpdating(false);
            }
        };      

        updateTransaction();    
    }, [auc_id]);    

    return (<>   
        <Navbar />     
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">       
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg">          
                <div className="flex flex-col items-center space-y-2 pt-8 px-6">           
                    <div className="rounded-full bg-green-50 p-3 relative">             
                        <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center">               
                            <span className="text-green-500 font-bold text-2xl">✓</span>             
                        </div>           
                    </div>           
                    <h1 className="text-2xl font-bold text-gray-900">             
                        Payment Successful!           
                    </h1>         
                </div>                  

                <div className="text-center px-6 pt-4">           
                    {isUpdating ? (             
                        <p className="text-gray-600 mb-4">               
                            Updating your transaction...             
                        </p>           
                    ) : error ? (             
                        <div className="text-red-500 mb-4">               
                            Error: {error}               
                            <p className="text-sm text-gray-500 mt-2">                 
                                Don't worry, your payment was processed. Please contact support if needed.               
                            </p>             
                        </div>           
                    ) : (             
                        <p className="text-gray-600 mb-4">               
                            Thank you for your payment. Your transaction has been completed               
                            and a receipt has been emailed to you.             
                        </p>           
                    )}         
                </div>                  

                <div className="px-6 pb-3 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">           
                    <button              
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"             
                        onClick={() => navigate('/buyer')}           
                    >             
                        Go to Dashboard           
                    </button>                   
                </div>       
            </div>     
        </div>     
        <Footer />     
    </>); 
};  

export default PaymentSuccess;
