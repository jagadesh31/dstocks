import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Loader from "../components/loader";

const Watchlist = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [watchlistNames, setWatchlistNames] = useState([]);


  const options = ["all", "dankmemes", "wholesomememes", "deepfriedmemes", "funny"];
  const [currentOption, setCurrentOption] = useState(options[0]);



  const handleRemoveFromWatchlist = (name) => {
    axios
      .post(`http://localhost:5000/user/removeWatchlist`, {
        userId: auth.user._id,
        memeName: name,
      })
      .then(() => {
        setData((prev) => prev.filter((meme) => meme.name !== name));
        setWatchlistNames((prev) => prev.filter((m) => m !== name));
      })
      .catch((err) => {
        console.error("Remove watchlist error:", err);
      });
  };


  const fetchWatchlist = () => {
    axios
      .get(`http://localhost:5000/user/watchlist?userId=${auth.user._id}`)
      .then((res) => {
        setData(res.data);
        setWatchlistNames(res.data.map((meme) => meme.name));
        setTimeout(() => setLoading(false), 500);
      })
      .catch((err) => {
        console.error("Watchlist fetch error:", err);
        setLoading(false);
      });
  };


  useEffect(() => {
    setLoading(true);
    fetchWatchlist();
    const intervalId = setInterval(fetchWatchlist, 5000);

    return () => clearInterval(intervalId);
  }, [currentOption]);

return (
  <div className="backgroundDiv min-h-screen bg-[#0D1421] flex justify-center items-center">
    <div className="container w-[85%] flex flex-col gap-4 rounded-xl items-center justify-start">
      <h2 className="text-xl mb-4 text-white font-bold text-[24px]">WatchList</h2>

      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <p className="text-white text-lg">Your watchlist is empty.</p>
      ) : (
        <div className="w-full flex flex-wrap gap-4 justify-center items-start">
          <div className="memes w-full flex justify-center items-center overflow-x-auto">
            <table className="py-[12px] px-[15px] text-start border-[1px] border-[#ddd] w-full">
              <thead>
                <tr className="bg-[#f8f9fa] text-black w-full text-[16px] md:text-[18px]">
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]"> </th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">#</th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">Name</th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]"> </th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">Price</th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">1h</th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">2hr</th>
                  <th className="py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]">24h</th>
                </tr>
              </thead>
              <tbody>
                {data.map((meme, idx) => (
                  <tr key={idx} className="py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd]">
                    <td className="py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd]">
                      <span
                        className="cursor-pointer text-yellow-400"
                        onClick={() => handleRemoveFromWatchlist(meme.name)}
                        title="Remove from Watchlist"
                      >
                        ★
                      </span>
                    </td>
                    <td className="py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd]">{idx + 1}</td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">
                      <div className="flex flex-col">
                        <span>{meme.author || "Unknown"}</span>
                        <span className="font-semibold">{meme.name}</span>
                      </div>
                    </td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">
                      <span
                        className="btn py-1 px-2 text-blue-600 border border-blue-700 rounded-md cursor-pointer"
                        onClick={() => navigate(`/meme/${meme.name}`)}
                      >
                        Buy
                      </span>
                    </td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">
                      ₹{parseFloat(meme.price).toFixed(2)}
                    </td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">1hr</td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">2hr</td>
                    <td className="py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]">24hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default Watchlist;
