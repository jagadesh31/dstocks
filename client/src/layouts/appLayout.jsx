   import { Outlet ,useNavigate} from "react-router-dom";
   import { useState, useEffect } from "react";
   import useRefreshToken from '../hooks/useRefreshToken';
   import useAuth from '../hooks/useAuth';

const AppLayout = () => {
      let navigate = useNavigate();
       const [isLoading, setIsLoading] = useState(true);
       const refresh = useRefreshToken();
       const { auth} = useAuth();
   
       useEffect(() => {
        let isMounted = true;
           const verifyRefreshToken = async () => {
               try {
                   await refresh();
               } catch (err) {
                   console.error(err);
               }
   
               finally {
                   setIsLoading(false);
               }
           }
   
           !auth?.accessToken && isMounted ? verifyRefreshToken() : setIsLoading(false);

     return () => {
         isMounted = false; 
         };
       }, [])
   
       useEffect(() => {
           console.log(auth)
           console.log(`isLoading: ${isLoading}`)
       }, [isLoading])
   
return (
  <>
    {isLoading ? <p>Loading...</p> : <Outlet />}
  </>);
   }


export default AppLayout;

