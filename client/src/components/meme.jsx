import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import useAuth from '../hooks/useAuth'
import {useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function MemeTemplate({ type, memes }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleToggleWatchlist = (name) => {
    axios.post('http://localhost:5000/user/watchlist/toggle', {
      userId: auth.user._id,
      name
    }).then(res => {
      const newList = res.data.watchlist;
      setWatchlist(newList);
    }).catch(err => {
      console.error("Error toggling watchlist:", err);
    });
  };



  useEffect(() => {
    if (!auth?.user?._id) return;
    axios.get(`http://localhost:5000/user/watchlist?userId=${auth.user._id}`)
      .then(res => {
        setWatchlist(res.data || []);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching watchlist:", err);
        setLoading(false);
      });
  }, [auth.user._id]);


  return (
    <div className="memes w-full flex justify-center items-center overflow-x-auto">
      <table className='py-[12px] px-[15px] text-start border-[1px] border-[#ddd] w-full'>
        <thead>
          <tr className='bg-[#f8f9fa] text-black w-full text-[16px] md:text-[18px]'>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'> </th>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>#</th>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Name</th>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>   </th>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Price</th>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>1h</th>
            <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>2hr</td>
            <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>24h</th>
          </tr>
        </thead>
        <tbody>
          {memes.length && memes.map((meme, idx) => {
            return (<tr className='py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd] border-[1px]' key={idx}>
              <td className='py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd]'>
                {
                  watchlist.includes(meme.name)
                    ? <FaStar className="text-yellow-400 cursor-pointer" onClick={() => handleToggleWatchlist(meme.name)} />
                    : <CiStar className="cursor-pointer" onClick={() => handleToggleWatchlist(meme.name)} />
                }
              </td>

              <td className='py-[12px] px-[15px] text-start text-white border-b-[1px] border-[#ddd]'>{idx + 1}</td>
              <td className='py-[12px] px-[18px] text-start  text-white border-b-[1px] border-[#ddd] flex flex-col gap-1'>
                <span className="title">{meme.author}</span>
                <span className="title">{meme.name}</span>
              </td>
              <td className='py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]'><span className="btn py-1 px-1 text-blue-600 border-1 rounded-md border-blue-700 cursor-pointer" onClick={() => navigate(`/meme/${meme.name}`)}>Buy</span></td>
              <td className='py-[12px] px-[18px] text-start  text-white border-b-[1px] border-[#ddd]'>{meme.price} Coins</td>
              <td className='py-[12px] px-[18px] text-start  text-white border-b-[1px] border-[#ddd]'>1hr</td>
              <td className='py-[12px] px-[18px] text-start text-white border-b-[1px] border-[#ddd]'>2hr</td>
              <td className='py-[12px] px-[18px] text-start  text-whiteborder-b-[1px] border-[#ddd]'>24hr</td>
            </tr>)
          })}
        </tbody>
      </table>

    </div>
  )
}

export default MemeTemplate