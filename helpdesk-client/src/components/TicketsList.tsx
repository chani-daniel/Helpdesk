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
  Alert,
  Chip
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

function TicketsList() {
  const { user, token } = useAuth();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Tickets
        </Typography>
        
        {user?.role === 'customer' && (
          <Button 
            variant="contained" 
            onClick={() => navigate('/tickets/new')}
          >
            Create New Ticket
          </Button>
        )}
      </Box>

      {filteredTickets.length === 0 ? (
        <Alert severity="info">
          No tickets found. {user?.role === 'customer' && 'Create your first ticket!'}
        </Alert>
      ) : (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2
          }}
        >
          {filteredTickets.map(ticket => (
            <Card 
              key={ticket.id} 
              sx={{ 
                '&:hover': { boxShadow: 6 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {ticket.subject}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {ticket.description.length > 100 
                    ? ticket.description.substring(0, 100) + '...' 
                    : ticket.description}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip 
                    label={ticket.status_name} 
                    color={ticket.status_name === 'open' ? 'warning' : 'success'}
                    size="small"
                  />
                  <Chip 
                    label={ticket.priority_name} 
                    color={ticket.priority_name === 'High' ? 'error' : 'default'}
                    size="small"
                  />
                </Stack>
                
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </Typography>

                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TicketsList;