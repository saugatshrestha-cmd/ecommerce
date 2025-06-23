import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {

  return (
    <div className="p-6 mt-40 text-center">
      <h1 className="text-2xl font-bold p-6">Payment Successful 🎉</h1>
      <Link to="/" className="inline-block bg-black text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition">
        Go to Homepage
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
