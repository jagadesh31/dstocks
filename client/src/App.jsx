// App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import AppLayout from './layouts/appLayout';
import NotFound from './pages/notFound';
import ProtectedRoute from './components/protectedRoute'
import MemeInfo from './pages/memeInfo'
import Portfolio from './pages/portfolio';
import Watchlist from './pages/watchlist';
import Leaderboard from './pages/leaderboard';


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        index:true,
        element: <Home />
        },
      {
        element: <ProtectedRoute />,
        children: [
        {
        path:'dashboard',
        element: <Home />
        },
        {
        path:'meme/:memeName',
        element: <MemeInfo />
        },
        {
        path:'watchlist',
        element: <Watchlist />
        },
        {
        path:'portfolio',
        element: <Portfolio/>
        },
        {
        path:'leaderboard',
        element: <Leaderboard/>
        }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
