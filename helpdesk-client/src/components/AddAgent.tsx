import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import { useAuth } from '../contexts/context';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type AddAgentFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function AddAgent() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<AddAgentFormData>();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const password = watch('password');

  const onSubmit = async (data: AddAgentFormData) => {
    try {
      await axios.post(
        'http://localhost:4000/users',
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'agent'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Agent Added Successfully!',
        text: `${data.name} has been added as an agent`,
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add agent';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 3
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', padding: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Agent
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create a new support agent account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Agent Name"
              fullWidth
              margin="normal"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message as string}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { 
                  value: 6, 
                  message: "Password must be at least 6 characters" 
                }
              }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.password}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {errors.password && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                      {errors.password.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm password",
                validate: value => value === password || "Passwords do not match"
              }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.confirmPassword}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                  {errors.confirmPassword && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                      {errors.confirmPassword.message}
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
                Add Agent
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/dashboard')}
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

export default AddAgent;