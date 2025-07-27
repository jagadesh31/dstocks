import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from '../layouts/header'



const ProtectedRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth)

    return (
       auth?.user 
                ? <div className="ack w-screen h-screen bg-[#0D1421]">
        <Header/>
        <Outlet/>
        </div>
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;