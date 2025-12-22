import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import Loader from "../components/loader";
import { createPortal } from "react-dom";
import useAuth from "./../hooks/useAuth";
import { toast } from "react-toastify";
import { FaChartLine } from "react-icons/fa";

function MemeInfo() {
  const { auth } = useAuth();
  const { memeName } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuy, setShowBuy] = useState(false);
  const [priceAnim, setPriceAnim] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function fetch() {
      axios
        .get(`${import.meta.env.VITE_SERVER_BASE_URL}/memes/info?memeName=${memeName}`)
        .then((res) => {
          if (!res.data) return navigate("/");
          const entry = {
            ...res.data,
            timeStamp: new Date().toISOString(),
          };
          setData((prev) => {
            if (
              prev.length &&
              entry.price !== prev[prev.length - 1].price
            ) {
              setPriceAnim(true);
              setTimeout(() => setPriceAnim(false), 400);
            }
            return [...prev.slice(-49), entry];
          });
          if (loading)
            setTimeout(() => setLoading(false), 200);
        })
        .catch(() => toast.error("Failed to fetch meme data"));
    }
    fetch();
    const interval = setInterval(fetch, import.meta.env.VITE_FREQUENCY);
    return () => clearInterval(interval);
  }, [memeName, navigate, loading]);

  const current = data[data.length - 1];
  const high = data.length ? Math.max(...data.map((d) => d.price)) : 0;
  const low = data.length ? Math.min(...data.map((d) => d.price)) : 0;

  let domainLow = low, domainHigh = high;
  if (high !== low) {
    const margin = (high - low) * 0.04;
    domainLow = low - margin;
    domainHigh = high + margin;
  } else {
    domainLow = low - 1;
    domainHigh = high + 1;
  }

  return (
    <div className="bg-[#F7F4ED] min-h-screen pt-8 pb-6 px-3 sm:px-6 md:px-12 mt-16">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Info Section */}
            <section className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 shadow-lg p-5 flex flex-col mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <h1 className="text-2xl lg:text-3xl font-semibold text-black">
                  {current?.name}
                </h1>
                <span className="bg-black text-xs px-2 py-0.5 rounded text-white flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <div className="text-gray-700 text-base mb-4">
                by {current?.author}
              </div>
              <div className="mb-6">
                <span className={
                  "text-2xl lg:text-3xl font-bold transition-transform duration-300 " +
                  (priceAnim ? "text-red-600 scale-105" : "text-black")
                }>
                  ${current?.price}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4 mb-7">
                <Stat label="High" value={`₹${high}`} />
                <Stat label="Low" value={`₹${low}`} />
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setShowBuy(true)}
                  className="flex-1 bg-black hover:bg-gray-900 text-white py-2.5 rounded-lg font-medium transition"
                >
                  Buy Now
                </button>
                <Link to="/" className="flex-1">
                  <button className="w-full border border-black text-black rounded-lg font-medium py-2.5 transition hover:bg-gray-100">
                    Back
                  </button>
                </Link>
              </div>
            </section>

            {/* Chart Section */}
            <section className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 shadow-lg p-5 flex flex-col">
              <div className="text-black font-medium text-base flex items-center gap-2 mb-3">
                <FaChartLine /> Price Chart (Live)
              </div>
              <StockChart data={data} domain={[domainLow, domainHigh]} />
            </section>
          </div>
        )}

        {showBuy &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <dialog
                open
                className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-sm relative"
              >
                <button
                  onClick={() => setShowBuy(false)}
                  className="absolute top-3 right-3 text-gray-600 text-2xl font-bold hover:text-black transition"
                >
                  ×
                </button>
                <BuyDialog data={current} auth={auth} setIsOpen={setShowBuy} />
              </dialog>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div>
    <span className="block text-xs text-gray-600 mb-1">{label}</span>
    <span className="block text-lg font-bold text-black">{value}</span>
  </div>
);

const StockChart = ({ data, domain }) => {
  const CustomTooltip = ({ active, payload }) =>
    active && payload?.length ? (
      <div className="bg-white border border-black rounded p-2 text-xs shadow-lg">
        <div className="text-black font-semibold">₹{payload[0].value}</div>
      </div>
    ) : null;

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timeStamp"
          stroke="#4B5563"
          tick={{ fill: "#4B5563", fontSize: 11 }}
          minTickGap={15}
          hide={data.length < 2}
        />
        <YAxis
          type="number"
          domain={domain}
          stroke="#4B5563"
          tick={{ fill: "#4B5563", fontSize: 11 }}
        />
        <Tooltip content={CustomTooltip} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#DC2626"
          strokeWidth={2.5}
          dot={{ fill: "#DC2626", r: 2 }}
          name="Price (₹)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

function BuyDialog({ data, auth, setIsOpen }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPrice = data?.price * quantity;

  function buyHandler() {
    if (!auth?.user?._id) return toast.error("Please login to buy");
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/user/buy?name=${data.name}&userId=${auth.user._id}&price=${data.price}&quantity=${quantity}`
      )
      .then(() => {
        toast.success(
          `Successfully bought ${quantity} ${data.name} meme stock(s)!`
        );
        setIsOpen(false);
      })
      .catch(() => toast.error("Purchase failed. Please try again."))
      .finally(() => setLoading(false));
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-5 text-center">
        Buy Meme Stock
      </h2>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-gray-700 block mb-1">
            Meme Name
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-black">
            {data?.name}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700 block mb-1">
            Price per Unit
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-black">
            ₹{data?.price}
          </div>
        </div>
        <div>
          <label htmlFor="stocks" className="text-sm text-gray-700 block mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="stocks"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="px-3 py-2 w-full bg-gray-100 text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="flex justify-between items-center px-3 py-2.5 bg-black/10 border border-black rounded-lg mt-2">
          <span className="text-black font-medium">Total Price</span>
          <span className="font-bold text-black text-lg">₹{totalPrice}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={buyHandler}
        disabled={loading}
        className="w-full mt-5 px-5 py-2.5 rounded-lg bg-black hover:bg-gray-900 disabled:bg-gray-500 text-white font-semibold transition"
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>
    </div>
  );
}

export default MemeInfo;