import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Loader from "../components/loader";
import { MemesContainer } from '../components/meme';

const Watchlist = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchWatchlist = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/watchlist?userId=${auth.user._id}`)
      .then((res) => {
        console.log(res.data)
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Watchlist fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchWatchlist();
    const intervalId = setInterval(fetchWatchlist, import.meta.env.VITE_FREQUENCY);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4ED] pt-20">
      <div className="container w-[90%] md:w-[85%] flex flex-col gap-8 rounded-xl mx-auto py-8">
        
        {loading ? (
          <Loader />
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">Your watchlist is empty.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-all"
            >
              Explore Memes
            </button>
          </div>
        ) : (
          <MemesContainer 
            memes={data} 
            category="Your Watchlist" 
            isWatchlist={true}
          />
        )}
      </div>
    </div>
  );
};

export default Watchlist;