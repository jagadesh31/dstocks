import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import useLogout from "../hooks/useLogout";
import { MemesContainer } from '../components/meme';
import axios from 'axios';
import Loader from '../components/loader';
import Header from "../layouts/header";

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loading, setLoading] = useState(true);
    const [allData, setAllData] = useState({});
    
    const options = ['all', 'dankmemes','deepfriedmemes', 'funny'];
    
    const signOut = async () => {
        await logout();
    };

    const fetchAllData = async (isInitialLoad = false) => {
        try {
            const requests = options.map(option => 
                axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/memes/fetch?memeType=${option}`)
            );
            
            const responses = await Promise.all(requests);
            
            const dataMap = {};
            options.forEach((option, idx) => {
                dataMap[option] = responses[idx].data;
            });
            
            setAllData(dataMap);

            if (isInitialLoad) {
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching memes:", err);
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAllData(true);
     
        const intervalId = setInterval(() => {
            fetchAllData(false); 
        }, import.meta.env.VITE_FREQUENCY);
        
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
        <Header/>
        <div className='min-h-screen mt-[80px] bg-[#F7F4ED]'>
            <div className='container w-[90%] md:w-[85%] flex flex-col gap-8 rounded-xl mx-auto py-8'>
                
                <div className='main w-full'>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className='all flex flex-col gap-12'>
                            {options.map(option => (
                                <MemesContainer 
                                    key={option} 
                                    memes={allData[option] || []} 
                                    category={option} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;