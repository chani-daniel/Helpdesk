
import { RouterProvider } from 'react-router-dom';
import './App.css'
import { router } from './routes/route';
import { AuthProvider } from './contexts/context';

function App() {

 return (
 <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
 );
}

export default App
