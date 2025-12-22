import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function MemesContainer({ memes, category, isWatchlist }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const scrollAmount = 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!memes || memes.length === 0) return null;

    return (
        <div className='w-full'>
            <div className='title text-black text-2xl font-bold pb-6 capitalize border-b border-gray-300'>
                {category}
            </div>

            <div className='memesScrollContainer flex items-center relative mt-6'>
                <button 
                    className="leftArrow hidden md:block absolute left-0 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                    onClick={() => scroll('left')}
                >
                    <span className="text-xl font-bold">‹</span>
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    style={{ scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
                    className='overflow-y-hidden flex gap-6 md:gap-8 lg:gap-10 overflow-x-auto scroll-smooth px-4 md:px-12'
                >
                    {memes.map((meme, idx) => (
                        <MemeCard 
                            key={`${meme.name}-${idx}`} 
                            meme={meme} 
                            index={idx}
                            isWatchlist={isWatchlist}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button 
                    className="rightArrow hidden md:block absolute right-0 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                    onClick={() => scroll('right')}
                >
                    <span className="text-xl font-bold">›</span>
                </button>
            </div>
        </div>
    );
}

export function MemeCard({ meme, index, isWatchlist }) {
    const [isInWatchlist, setIsInWatchlist] = useState(isWatchlist || false);
    const [previousPrice, setPreviousPrice] = useState(meme.price);
    const [priceChange, setPriceChange] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Check if meme is in watchlist on component mount and when meme changes
    useEffect(() => {
        if (!auth?.user?._id) {
            setIsInWatchlist(false);
            return;
        }
        
        const checkWatchlist = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/user/watchlist?userId=${auth.user._id}`);
                const watchlistData = res.data || [];
                
                // Handle both array of meme objects and array of meme names
                const isInList = watchlistData.some(item => {
                    if (typeof item === 'string') {
                        return item === meme.name;
                    } else if (item && typeof item === 'object') {
                        return item.name === meme.name;
                    }
                    return false;
                });
                
                setIsInWatchlist(isInList);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
                setIsInWatchlist(false);
            }
        };

        checkWatchlist();
    }, [auth?.user?._id, meme.name, meme]);

    // Detect price changes
    useEffect(() => {
        if (previousPrice !== meme.price) {
            if (meme.price > previousPrice) {
                setPriceChange('up');
            } else if (meme.price < previousPrice) {
                setPriceChange('down');
            }
            
            setPreviousPrice(meme.price);
            
            const timer = setTimeout(() => {
                setPriceChange(null);
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [meme.price, previousPrice]);

    const handleToggleWatchlist = async (e) => {
        e.stopPropagation();
        
        if (!auth?.user?._id) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            // Optimistically update the UI
            const newWatchlistState = !isInWatchlist;
            setIsInWatchlist(newWatchlistState);

            const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/user/watchlist/toggle`, {
                userId: auth.user._id,
                name: meme.name
            });
            
            // Ensure the state matches the server response
            if (res.data && typeof res.data.isInWatchlist !== 'undefined') {
                setIsInWatchlist(res.data.isInWatchlist);
            } else if (res.data && res.data.watchlist) {
                // Fallback: check if meme is in the returned watchlist array
                const isInUpdatedList = res.data.watchlist.some(item => {
                    if (typeof item === 'string') {
                        return item === meme.name;
                    } else if (item && typeof item === 'object') {
                        return item.name === meme.name;
                    }
                    return false;
                });
                setIsInWatchlist(isInUpdatedList);
            }
            
        } catch (err) {
            console.error("Error toggling watchlist:", err);
            // Revert optimistic update on error
            setIsInWatchlist(!isInWatchlist);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/meme/${meme.name}`);
    };

    const handleBuyClick = (e) => {
        e.stopPropagation();
        navigate(`/meme/${meme.name}`);
    };

    return (
        <div 
            className='memeCard cursor-pointer flex-shrink-0 group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className='imageContainer relative overflow-hidden rounded-t-xl h-[180px] w-[160px] md:h-[240px] md:w-[200px] border border-gray-200'>
                <img
                    src={meme.image || `https://via.placeholder.com/200x300?text=${meme.name}`}
                    alt={meme.name}
                    draggable='false'
                    className='w-full h-full object-cover object-center transition duration-500 ease-in-out group-hover:scale-110'
                />
                
                
                {!auth?.user?._id && <div className='absolute top-3 right-3'>
                    <button 
                        onClick={handleToggleWatchlist}
                        disabled={isLoading}
                        className={`p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110 ${
                            isInWatchlist 
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600 border border-yellow-600' 
                                : 'bg-white/95 text-gray-600 hover:bg-white border border-gray-300 hover:border-gray-400'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        ) : isInWatchlist ? (
                            <FaStar className="text-lg" />
                        ) : (
                            <CiStar className="text-lg" />
                        )}
                    </button>
                </div>}

                {/* Price Badge */}
                <div className='absolute bottom-3 left-3'>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        priceChange === 'up' 
                            ? 'bg-green-100 text-green-700 scale-110 border border-green-300' 
                            : priceChange === 'down' 
                            ? 'bg-red-100 text-red-700 scale-110 border border-red-300' 
                            : 'bg-black/90 text-white border border-gray-600'
                    }`}>
                        <div className='flex items-center gap-1'>
                            <span>₹{meme.price}</span>
                            {priceChange === 'up' && (
                                <span className='animate-bounce text-green-600'>▲</span>
                            )}
                            {priceChange === 'down' && (
                                <span className='animate-bounce text-red-600'>▼</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className='p-3 flex justify-between items-start'>
                <div className='flex flex-col flex-1 min-w-0 mr-2'>
                    <h3 className='text-black font-bold text-sm truncate mb-1'>
                        {meme.name}
                    </h3>
                    <div className='text-gray-600 text-xs truncate'>
                        by {meme.author || "Unknown"}
                    </div>
                </div>
                
                {/* Buy Button */}
                <button 
                    onClick={handleBuyClick}
                    className='bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all transform hover:scale-105 whitespace-nowrap'
                >
                    Buy
                </button>
            </div>

           
            {isWatchlist && isInWatchlist && (
                <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    ⭐
                </div>
            )}
        </div>
    );
}

export default MemesContainer;