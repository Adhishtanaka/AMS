import Footer from "../components/Footer";
import Navbar from "../components/navbar";

const PaymentCanceled = () => {
    return (
      <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center space-y-2 pt-8 px-6">
            <div className="rounded-full bg-red-50 p-3 relative">
              <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                <span className="text-red-500 font-bold text-xl">×</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Canceled
            </h1>
          </div>
          <div className="text-center px-6 py-4">
            <p className="text-gray-600 mb-4">
              Your payment was canceled and no charges were made to your account.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">
                If you have any questions or concerns, please contact our support team 
                for assistance.
              </p>
            </div>
          </div>
          
          <div className="px-6 pb-3 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <button 
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
            
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  };
  
  export default PaymentCanceled;