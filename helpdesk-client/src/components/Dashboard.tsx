import { useAuth } from '../contexts/context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Ticket = {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  status_name: string;
  priority_id: number;
  priority_name: string;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
};

function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:4000/tickets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTickets(response.data);
      } catch (err) {
        setError('Failed to load tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const getFilteredTickets = () => {
    if (!user) return [];
    
    if (user.role === 'customer') {
      return tickets.filter(t => t.created_by === user.id);
    }
    
    if (user.role === 'agent') {
      return tickets.filter(t => t.assigned_to === user.id);
    }
    
    return tickets;
  };

  const filteredTickets = getFilteredTickets();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.name}! 👋
          </Typography>
          
          <Typography color="textSecondary" gutterBottom>
            Role: {user?.role}
          </Typography>

          <Button 
            variant="outlined" 
            color="error" 
            onClick={logout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      {user?.role === 'customer' && (
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Tickets
                </Typography>
                <Typography variant="h3" color="primary">
                  {filteredTickets.length}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/tickets/new')}
                >
                  Create New Ticket
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/tickets')}
                >
                  View All My Tickets
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      )}

      {user?.role === 'agent' && (
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assigned Tickets
                </Typography>
                <Typography variant="h3" color="primary">
                  {filteredTickets.length}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/tickets')}
                >
                  View Assigned Tickets
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Tickets
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {filteredTickets.filter(t => t.status_name === 'Open').length}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      )}

      {user?.role === 'admin' && (
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h3" color="primary">
                  {tickets.length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Open Tickets
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {tickets.filter(t => t.status_name === 'open').length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resolved Tickets
                </Typography>
                <Typography variant="h3" color="success.main">
                  {tickets.filter(t => t.status_name === 'closed').length}
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Actions
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/tickets')}
                >
                  Manage All Tickets
                </Button>
                <Button 
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/admin/add-agent')}
                >
                  Add New Agent
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
}

export default Dashboard;