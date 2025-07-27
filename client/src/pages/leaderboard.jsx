import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";

function Leaderboard() {
  const { auth } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/user/leaderboard")
      .then(res => {
        setTopUsers(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load leaderboard", err);
        setLoading(false);
      });
  }, []);

  return (
        <div className='backgroundDiv min-h-screen bg-[#0D1421] flex justify-center items-start mt-20'>
      <div className='container w-[85%] h-full flex flex-col gap-1 rounded-xl items-center justify-start'>
          <h4 className="title text-white font-bold text-[24px]">Leaderboard</h4>
    <div className="w-full flex justify-center items-center overflow-x-auto py-6">
      <table className="w-full border border-[#ddd]">
        <thead>
          <tr className="bg-[#f8f9fa] text-black text-[16px] md:text-[18px]">
            <th className="py-2 px-4 border-b border-[#ddd]">Rank</th>
            <th className="py-2 px-4 border-b border-[#ddd]">Profile</th>
            <th className="py-2 px-4 border-b border-[#ddd]">Username</th>
            <th className="py-2 px-4 border-b border-[#ddd]">Email</th>
            <th className="py-2 px-4 border-b border-[#ddd]">Profit</th>
          </tr>
        </thead>
        <tbody>
          {
            !loading && topUsers.length > 0 ? (
              topUsers.map((user, idx) => (
                <tr key={user._id} className="text-white border-b border-[#ddd]">
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 font-semibold text-green-400">₹{user.totalProfit?.toFixed(2) || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-white py-6">
                  {loading ? "Loading leaderboard..." : "No users found"}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
    </div>
        </div>
  );
}

export default Leaderboard;
