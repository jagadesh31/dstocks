import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import Loader from '../components/loader.jsx';

function Portfolio() {
  const { auth, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    fetchHoldings();
    const intervalId = setInterval(fetchHoldings, 5000);

    return () => clearInterval(intervalId);
  }, [auth.user._id]);

  const fetchHoldings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/holdings?userId=${auth.user._id}`);
      setHoldings(res.data.holdings);
    } catch (err) {
      console.error('Error fetching holdings:', err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const calculatePnL = (holding) => {
    const { buyPrice, quantity, currentPrice } = holding;
    const profit = (currentPrice - buyPrice) * quantity;
    const isProfit = profit >= 0;
    return {
      profit: profit.toFixed(2),
      isProfit,
    };
  };

  const calculateTotalPnL = () => {
    return holdings.reduce((acc, stock) => {
      const { buyPrice, quantity, currentPrice } = stock;
      return acc + (currentPrice - buyPrice) * quantity;
    }, 0);
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Loader />;



  return (
    <div className="backgroundDiv min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-white space-y-8">


        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">👤 Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>


        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-600">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                disabled
                value={auth.user.email}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 mt-1 text-amber-100 text-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Username</label>
              <input
                type="text"
                disabled
                value={auth.user.username}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 mt-1 text-amber-100 text-lg cursor-not-allowed"
              />
            </div>
          </div>
        </div>


        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-gray-600">
          <div className="full">
            <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
            <h2 className="text-xl font-semibold mb-4">
              Total {calculateTotalPnL() >= 0 ? "Profit" : "Loss"}:{" "}
              <span className={calculateTotalPnL() >= 0 ? "text-green-400" : "text-red-400"}>
                ₹{Math.abs(calculateTotalPnL()).toFixed(2)}
              </span>
            </h2>

          </div>
          {holdings.length === 0 ? (
            <p className="text-gray-400">No holdings found.</p>
          ) : (
            <div className="space-y-4">
              {holdings.map((stock, index) => {
                const { profit, isProfit } = calculatePnL(stock);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{stock.name}</h3>
                      <p className="text-sm text-gray-400">
                        Quantity: {stock.quantity} | Bought at ₹{stock.buyPrice}
                      </p>
                      <p className="text-sm text-gray-400">
                        Current Price: ₹{stock.currentPrice}
                      </p>
                    </div>
                    <div
                      className={`font-semibold text-lg ${isProfit ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                      {isProfit ? '+' : '-'}₹{Math.abs(profit)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
