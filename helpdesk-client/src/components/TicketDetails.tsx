import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/context';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

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
  assigned_to_name?: string;
  created_at: string;
};

type Comment = {
  id: number;
  ticket_id: number;
  author_id: number;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
};

type CommentFormData = {
  content: string;
};

type Status = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketResponse = await axios.get(`http://localhost:4000/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTicket(ticketResponse.data);

        const commentsResponse = await axios.get(`http://localhost:4000/tickets/${id}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(commentsResponse.data);

        if (user?.role === 'agent' || user?.role === 'admin') {
          const statusesResponse = await axios.get('http://localhost:4000/statuses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStatuses(statusesResponse.data);
        }

        if (user?.role === 'admin') {
          const usersResponse = await axios.get('http://localhost:4000/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const agentsList = usersResponse.data.filter((u: User) => u.role === 'agent');
          setAgents(agentsList);
        }
      } catch (err) {
        setError('Failed to load ticket details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, user]);

  const onSubmitComment = async (data: CommentFormData) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/tickets/${id}/comments`,
        { content: data.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data]);
      reset();

      Swal.fire({
        icon: 'success',
        title: 'Comment added!',
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add comment'
      });
    }
  };

  const handleStatusChange = async (newStatusId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update the status?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `http://localhost:4000/tickets/${id}`,
          { status_id: newStatusId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const statusName = statuses.find(s => s.id === newStatusId)?.name || '';
        setTicket({ ...ticket!, status_id: newStatusId, status_name: statusName });

        Swal.fire('Updated!', 'Status has been updated.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    }
  };

  const handleAssignAgent = async (agentId: number | null) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to assign this ticket?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, assign it!',
      cancelButtonText: 'No, cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `http://localhost:4000/tickets/${id}`,
          { assigned_to: agentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const agentName = agentId 
          ? agents.find(a => a.id === agentId)?.name 
          : null;
        
        setTicket({ ...ticket!, assigned_to: agentId, assigned_to_name: agentName || undefined });

        Swal.fire('Assigned!', 'Agent has been assigned.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to assign agent', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error || 'Ticket not found'}</Alert>
        <Button onClick={() => navigate('/tickets')} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Button onClick={() => navigate('/tickets')} sx={{ mb: 2 }}>
        ← Back to Tickets
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {ticket.subject}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={ticket.status_name}
              color={ticket.status_name === 'open' ? 'warning' : 'success'}
            />
            <Chip
              label={ticket.priority_name}
              color={ticket.priority_name === 'High' ? 'error' : 'default'}
            />
            {ticket.assigned_to && ticket.assigned_to_name && (
              <Chip
                label={`Assigned to: ${ticket.assigned_to_name}`}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {ticket.description}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Created: {new Date(ticket.created_at).toLocaleString()}
          </Typography>

          {(user?.role === 'agent' || user?.role === 'admin') && (
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2} 
              sx={{ mt: 3 }}
            >
              <FormControl fullWidth>
                <InputLabel>Change Status</InputLabel>
                <Select
                  value={ticket.status_id}
                  label="Change Status"
                  onChange={(e) => handleStatusChange(e.target.value as number)}
                >
                  {statuses.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {user?.role === 'admin' && (
                <FormControl fullWidth>
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    value={ticket.assigned_to || ''}
                    label="Assign to Agent"
                    onChange={(e) => handleAssignAgent(e.target.value ? Number(e.target.value) : null)}
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Comments ({comments.length})
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {comments.length === 0 ? (
            <Alert severity="info">No comments yet. Be the first to comment!</Alert>
          ) : (
            <Box sx={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              backgroundColor: '#e5ddd5',
              padding: 2,
              borderRadius: 2
            }}>
              <Stack spacing={1.5}>
                {comments.map((comment) => {
                  const isMyComment = comment.author_id === user?.id;
                  return (
                    <Box 
                      key={comment.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isMyComment ? 'flex-end' : 'flex-start',
                        mb: 0.5
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          backgroundColor: isMyComment ? '#dcf8c6' : 'white',
                          borderRadius: 2,
                          padding: 1.5,
                          boxShadow: 1,
                          position: 'relative',
                          '&::before': isMyComment ? {
                            content: '""',
                            position: 'absolute',
                            right: -8,
                            top: 10,
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid #dcf8c6',
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent'
                          } : {
                            content: '""',
                            position: 'absolute',
                            left: -8,
                            top: 10,
                            width: 0,
                            height: 0,
                            borderRight: '8px solid white',
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent'
                          }
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: isMyComment ? '#075e54' : '#1976d2',
                            mb: 0.5
                          }}
                        >
                          {isMyComment ? 'You' : comment.author_name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}>
                          {comment.content}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            textAlign: 'right',
                            color: 'text.secondary',
                            fontSize: '0.7rem'
                          }}
                        >
                          {new Date(comment.created_at).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Comment
          </Typography>

          <form onSubmit={handleSubmit(onSubmitComment)}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Your comment"
              {...register('content', {
                required: 'Comment cannot be empty',
                minLength: { value: 3, message: 'Comment must be at least 3 characters' }
              })}
              error={!!errors.content}
              helperText={errors.content?.message as string}
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained">
              Add Comment
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TicketDetails;