import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import Loader from '../components/loader.jsx';
import { MemesContainer } from '../components/meme';

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
      const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/holdings?userId=${auth.user._id}`);
      setHoldings(res.data.holdings || []);
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
      percentage: ((profit / (buyPrice * quantity)) * 100).toFixed(2)
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

  // Convert holdings to meme-like format for MemesContainer
  const portfolioData = holdings.map((holding, index) => {
    const { profit, isProfit, percentage } = calculatePnL(holding);
    return {
      name: holding.name,
      author: `Qty: ${holding.quantity}`,
      price: holding.currentPrice,
      buyPrice: holding.buyPrice,
      profit: parseFloat(profit),
      isProfit,
      percentage: parseFloat(percentage),
      image: `https://via.placeholder.com/200x300?text=${holding.name}`,
      isPortfolio: true
    };
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F7F4ED] mt-20">
      <div className="container w-[90%] md:w-[85%] flex flex-col gap-8 rounded-xl mx-auto py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
              Portfolio
            </h1>
            <p className="text-gray-600 text-lg">
              Your investments and performance
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-all  cursor-pointer"
          >
            Logout
          </button>
        </div>


        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Account Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">Email</label>
              <div className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-lg">
                {auth.user.email}
              </div>
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">Username</label>
              <div className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-lg">
                {auth.user.username}
              </div>
            </div>
          </div>
        </div>

  
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-4">
            Total {calculateTotalPnL() >= 0 ? "Profit" : "Loss"}
          </h2>
          <div className={`text-3xl md:text-4xl font-bold ${
            calculateTotalPnL() >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {calculateTotalPnL() >= 0 ? "+" : "-"}₹{Math.abs(calculateTotalPnL()).toFixed(2)}
          </div>
        </div>


        <div>
          <h2 className="text-3xl font-bold text-black mb-6">Your Holdings</h2>
          {portfolioData.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <p className="text-gray-600 text-lg mb-4">No holdings found.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-all cursor-pointer"
              >
                Start Trading
              </button>
            </div>
          ) : (
            <MemesContainer 
              memes={portfolioData} 
              category="Your Investments" 
              isPortfolio={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;