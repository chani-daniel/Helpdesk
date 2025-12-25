import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from '../components/Root';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import TicketsList from '../components/TicketsList';
import NewTicket from '../components/NewTicket';
import TicketDetails from '../components/TicketDetails';
import AddAgent from '../components/AddAgent';
import NotFound from '../components/NotFound';
import PrivateRoute from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      
      { path: "login", Component: Login },
      
      { path: "register", Component: Register },
      
      { 
        path: "dashboard", 
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      
      {
        path: "admin/add-agent",
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AddAgent />
          </PrivateRoute>
        )
      },
      
      { 
        path: "tickets", 
        children: [
          { 
            index: true, 
            element: (
              <PrivateRoute>
                <TicketsList />
              </PrivateRoute>
            )
          },
          
          { 
            path: "new", 
            element: (
              <PrivateRoute allowedRoles={['customer']}>
                <NewTicket />
              </PrivateRoute>
            )
          },
          
          { 
            path: ":id", 
            element: (
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            )
          },

        ]
      },
      
      { path: "*", Component: NotFound }
    ],
  },
]);