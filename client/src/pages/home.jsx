import { useNavigate, Link } from "react-router-dom";
import {useState,useEffect} from 'react'
import useLogout from "../hooks/useLogout";
import { MemeTemplate } from './../components/meme';
import axios from 'axios'
import Loader from '../components/loader'


const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loading,setLoading] = useState(true)
    const [data,setData]  = useState([]);
    let options = ['all','dankmemes','wholesomememes','deepfriedmemes','funny']
    let [currentOption, setCurrentOption] = useState(options[0]);
    const signOut = async () => {
        await logout();
    }

    function fetch(option){
    axios.get(`http://localhost:5000/memes/fetch?memeType=${option}`)
    .then((res)=>{
      console.log(res.data)
      setData(res.data)
      setTimeout(()=>setLoading(false),1000);
        }).
        catch((err)=>{
       console.log(err)
    })
    }

    useEffect(() => {
        setLoading(true);
        fetch(currentOption)
        let intervalId = setInterval(()=>{fetch(currentOption)},5000);
        return ()=>{
            clearInterval(intervalId)
        }
  }, [currentOption])


    return (
      <>
        <div className='backgroundDiv min-h-screen mt-[70px] bg-[#0D1421] flex justify-center items-center'>
      <div className='container w-[85%] flex flex-col gap-4 rounded-xl items-center justify-start'>
        <div className='options flex justify-center items-center'>
          <div className='optionsContainer border-1 shadow-md shadow-black flex justify-around items-center gap-3 border-[#929090] py-2 px-4 m-auto'>
            {options.map(option => {
              return (
                <span
                  key={option}
                  className={`p-1 px-3 font-bold text-lg text-white cursor-pointer ${
                    currentOption === option ? 'bg-[#4242FA]' : 'bg-transparent'
                  }`}
                  onClick={() => {
                    setCurrentOption(option)
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              )
            })}
          </div>
        </div>
        {loading?<Loader/>:(<MemeTemplate memes={data}/>        )}
        </div>
        </div>
      </>
    )
}

export default Home;