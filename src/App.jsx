import Analytics from './pages/analytics/Analytics';
import CreateQuize from './pages/createQuize/CreateQuize';
import Dashboard from './pages/dashboard/Dashboard';
import LoginAndSignUp from './pages/loginAndSignUp/LoginAndSignUp';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { useState } from 'react';
import TakeQuize from './pages/takeQuize/TakeQuize';
import HomePage from './pages/homepage/HomePage';

function App() {
  const [auth, setAuth] = useState(localStorage.getItem('auth-token'));

  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    {
      path: '/login',
      element: <LoginAndSignUp auth={auth} setAuth={setAuth} />,
    },
    {
      path: '/register',
      element: <LoginAndSignUp auth={auth} setAuth={setAuth} />,
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute auth={auth}>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: '/analytics',
      element: (
        <PrivateRoute auth={auth}>
          <Analytics />
        </PrivateRoute>
      ),
    },
    {
      path: '/createquize',
      element: (
        <PrivateRoute auth={auth}>
          <CreateQuize />
        </PrivateRoute>
      ),
    },
    {
      path: '/:id',
      element: <TakeQuize />,
    },
    { path: '*', element: <LoginAndSignUp auth={auth} /> },
  ]);
  return <RouterProvider router={router} />;
}

const PrivateRoute = ({ auth, children }) => {
  return auth ? children : <Navigate to='/login' />;
};

export default App;
