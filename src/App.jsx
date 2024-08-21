import LoginAndSignUp from './pages/LoginAndSignUp';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <h1>Hello root</h1> },
  { path: '/login', element: <LoginAndSignUp /> },
  { path: '/register', element: <LoginAndSignUp /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
