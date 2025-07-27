import axios from "../api/axios";
import useAuth from "./useAuth";
import {useNavigate} from 'react-router-dom'

const useLogout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axios('/auth/logout', {
                withCredentials: true
            });
          navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout