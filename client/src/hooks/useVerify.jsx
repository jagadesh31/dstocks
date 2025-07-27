import axios from '../api/axios';
import useAuth from './useAuth';

const useVerifyToken = () => {
    const { setAuth } = useAuth();

    const user = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
              user:response.data.user
            }
        });
        return response.data.user;
    }
    
    return user;
};

export default useVerifyToken;