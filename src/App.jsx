import Analytics from './pages/analytics/Analytics';
import CreateQuize from './pages/createQuize/createQuize';
import Dashboard from './pages/dashboard/Dashboard';
import LoginAndSignUp from './pages/loginAndSignUp/LoginAndSignUp';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <h1>Hello root</h1> },
  { path: '/login', element: <LoginAndSignUp /> },
  { path: '/register', element: <LoginAndSignUp /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/createquize', element: <CreateQuize /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
