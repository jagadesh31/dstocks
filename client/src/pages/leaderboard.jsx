import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
function Leaderboard() {
  const { auth } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/leaderboard`)
      .then(res => {
        setTopUsers(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load leaderboard", err);
        setLoading(false);
      });
  }, []);


  const getRankBadge = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-400";
      case 2: return "bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-400";
      case 3: return "bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-400";
      default: return "border-l-4 border-transparent hover:bg-gray-50";
    }
  };

  return (
    <div className='min-h-screen bg-[#F7F4ED] pt-20'>
      <div className='container w-[90%] md:w-[85%] mx-auto py-8'>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-3xl font-bold text-black mb-4">
            Leaderboard
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : topUsers.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-12 bg-white rounded-xl shadow-lg">
            No users found
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-black">All Traders</h2>
              <p className="text-gray-600 mt-2">Ranked by total profit</p>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-4 md:px-6 text-left text-gray-700 font-semibold text-sm md:text-base">Rank</th>
                    <th className="py-4 px-4 md:px-6 text-left text-gray-700 font-semibold text-sm md:text-base">Profile</th>
                    <th className="py-4 px-4 md:px-6 text-left text-gray-700 font-semibold text-sm md:text-base">Username</th>
                    <th className="py-4 px-4 md:px-6 text-left text-gray-700 font-semibold text-sm md:text-base hidden md:table-cell">Email</th>
                    <th className="py-4 px-4 md:px-6 text-left text-gray-700 font-semibold text-sm md:text-base">Total Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-gray-200 transition-colors duration-200 ${getRankColor(index + 1)}`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-lg ${
                            index === 0 ? 'text-yellow-600' : 
                            index === 1 ? 'text-gray-600' : 
                            index === 2 ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            {getRankBadge(index + 1)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Profile Image Column */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center">
                          <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {index < 3 && (
                            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </td>
                      
                      {/* Username Column */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex flex-col">
                          <span className={`font-medium ${
                            index === 0 ? 'text-yellow-700' : 
                            index === 1 ? 'text-gray-700' : 
                            index === 2 ? 'text-orange-700' : 'text-gray-800'
                          }`}>
                            {user.username}
                          </span>

                        </div>
                      </td>
                      
                      {/* Email Column */}
                      <td className="py-4 px-4 md:px-6 text-gray-600 hidden md:table-cell">
                        {user.email}
                      </td>
                      
                      {/* Profit Column */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex flex-col items-start">
                          <span className={`font-bold text-lg ${
                            (user.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ₹{(user.totalProfit || 0).toFixed(2)}
                          </span>
                          {index < 3 && (
                            <span className="text-xs text-gray-500 mt-1">
                              Top Performer
                            </span>
                          )}
                        </div>
                      </td>
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
}

export default Leaderboard;