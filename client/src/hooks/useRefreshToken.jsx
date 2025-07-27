import {axiosPrivate} from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axiosPrivate.get('/auth/refresh');
        console.log(response)
        setAuth(prev => {
            console.log(prev);
            console.log(response.data.accessToken);
            return {
                ...prev,
                user:response.data.user,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;