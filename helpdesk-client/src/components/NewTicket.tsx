import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/context';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

type NewTicketFormData = {
  subject: string;
  description: string;
  priority_id: number;
};

type Priority = {
  id: number;
  name: string;
};

function NewTicket() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<NewTicketFormData>();

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await axios.get('http://localhost:4000/priorities', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPriorities(response.data);
      } catch (err) {
        console.error('Failed to load priorities:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load priorities'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPriorities();
  }, [token]);

  const onSubmit = async (data: NewTicketFormData) => {
    try {
      await axios.post('http://localhost:4000/tickets', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Ticket created successfully',
        timer: 1500
      });

      navigate('/tickets');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create ticket'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 600, margin: 'auto' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Create New Ticket
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Subject"
              fullWidth
              margin="normal"
              {...register("subject", {
                required: "Subject is required",
                minLength: { value: 3, message: "Subject must be at least 3 characters" }
              })}
              error={!!errors.subject}
              helperText={errors.subject?.message as string}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" }
              })}
              error={!!errors.description}
              helperText={errors.description?.message as string}
            />

            <Controller
              name="priority_id"
              control={control}
              rules={{ required: "Priority is required" }}
              defaultValue={priorities[0]?.id || 1}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.priority_id}>
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority">
                    {priorities.map(priority => (
                      <MenuItem key={priority.id} value={priority.id}>
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority_id && (
                    <Typography color="error" variant="caption">
                      {errors.priority_id.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
              >
                Create Ticket
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/tickets')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewTicket;