import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios'
import Loader from '../components/loader'
import { createPortal } from "react-dom"
import useAuth from './../hooks/useAuth';
import { toast } from 'react-toastify';

function MemeInfo() {
  let { auth } = useAuth();
  let { memeName } = useParams();
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function fetch() {
    axios.get(`http://localhost:5000/memes/info?memeName=${memeName}`)
      .then((res) => {
        console.log(res.data)
        if (!res.data.length) {
          console.log(data)
          return navigate('/');
        }
        setData(res.data)
        setTimeout(() => setLoading(false), 1000);
      }).
      catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetch();
    let id = setInterval(() => {
      fetch()
    }, 5 * 1000)


    return (() => {
      clearInterval(id)
    })
  }, [])

  return (
    <div className='backgroundDiv min-h-screen bg-[#0D1421] flex justify-center items-center'>
      <div className='container w-[85%] flex flex-col gap-4 rounded-xl'>
        {loading ? <Loader /> : (
          <div className='container flex flex-col px-4'>
            <div className='flex justify-between items-center py-8'>
              <div className='flex flex-col px-2 text-white'>
                <span className='title p-2 font-medium text-3xl overflow-hidden'>
                  Name <span className='duration p-2 font-medium text-3xl'>
                    {data[0]?.name}
                  </span>
                </span>

                <span className='title p-2 font-medium text-3xl overflow-hidden'>
                  Price <span className='duration p-2 font-medium text-3xl'>
                    {data[data.length - 1]?.price}
                  </span>
                </span>

              </div>
                <div className="box w-full flex justify-end gap-8 items-center">
                  <span className="buy px-2 py-2 border-2 font-medium text-[18px] border-blue-800 text-blue-600 cursor-pointer self-end justify-end items-end place-content-end" onClick={() => setIsOpen(true)}>Buy</span>
                <Link to='/'>
                <div className='cancelIcon text-4xl px-2 py-2 border-2 font-medium text-[18px] border-blue-800 text-blue-600 cursor-pointer'>Back</div>
              </Link>
                </div>
            </div>

            <div className="flex items-stretch gap-2 md:gap-4">
              <div className="left flex justify-center items-center pl-2 md:pl-4">
                {/* <div className='imageContainer overflow-hidden rounded-xl h-[150px] w-[105px] md:h-[250px] md:w-[175px] lg:h-[300px] lg:w-[210px] border-[#636363]  border-2'>
          <img
            // src={data.thumbnail}
            draggable='false'
            className='transition duration-500 ease-in-out hover:scale-105'
          />
      </div> */}
              </div>
              <StockChart data={data} />
            </div>

          </div>)}
        {isOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <dialog
                open
                className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[450px] relative border-none"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
                >
                  ×
                </button>

                <DefaultDialog data={data[data.length - 1]} auth={auth} setIsOpen={setIsOpen} />
              </dialog>
            </div>,
            document.body
          )}

      </div>
    </div>
  )
}

export default MemeInfo;



const StockChart = ({ data }) => {
  console.log(data)
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeStamp" />
        <YAxis type="number" domain={['dataMin', 'dataMax']} />
        <Tooltip />
        <Line
          type="linear"
          dataKey="price"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

function DefaultDialog({ data, auth, setIsOpen }) {
  const [quantity, setQuantity] = useState(1);

  const changeHandler = (e) => {
    setQuantity(e.target.value);
  };

  const buyHandler = () => {
    setIsOpen(false);
    axios
      .get(`http://localhost:5000/user/buy?name=${data.name}&userId=${auth.user._id}&price=${data.price}&quantity=${quantity}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        toast.success(`Successfully bought ${quantity} ${data.name} meme stock(s)!`);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 gap-6">
      <h2 className="text-2xl font-bold text-center text-blue-800">Buy DStocks</h2>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-lg font-semibold text-gray-700">Name</label>
          <p className="px-3 py-2 border rounded-md bg-gray-100">{data?.name}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-lg font-semibold text-gray-700">Price</label>
          <p className="px-3 py-2 border rounded-md bg-gray-100">₹{data?.price}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="stocks" className="text-lg font-semibold text-gray-700">Quantity</label>
          <input
            type="number"
            id="stocks"
            name="stocks"
            value={quantity}
            min={1}
            onChange={changeHandler}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-400"
            placeholder="Enter quantity"
          />
        </div>
      </div>

      <button
        onClick={buyHandler}
        className="mt-4 w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        Buy
      </button>
    </div>
  );
}
