import { Button, Container, Grid, TextField } from "@mui/material";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation, useQueryClient } from "react-query";
import useAuthStore from "../../utils/store/authStore";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface LoginFormInputs {
    email: string;
    password: string;
}


export default function LoginForm() {
    const URL = import.meta.env.VITE_HOST;

    const queryClient = useQueryClient();
    const setToken = useAuthStore((state) => state.setToken);
    const [error, setError]= useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();


    const loginMutation = useMutation<string, Error, LoginFormInputs>(
        async (data) => {
        setError(false)

            const response = await fetch(`${URL}/api/Login/authenticated`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if(!result.isSuccess){
                setError(true)
            }

            return result.customJwtToken;
        },
        {
            onSuccess: (token) => {
                if(token !== undefined){
                    setToken(token);
                    queryClient.invalidateQueries('token');
                }
            },
            onError: (error) => {
                console.log("error", error)
            }
        }
    );

    const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            await loginMutation.mutateAsync(data);
            console.log(data)
        } catch (error) {
            console.error('Login failed', error);
        }
    };


    const loginGoogleMutation = useMutation<string, Error, LoginFormInputs>(
        async (jwtGoogle) => {
            const response = await fetch(`${URL}/api/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "jwtAuthinticate": jwtGoogle }),
            });

            const result = await response.json();
            return result.customJwtToken;
        },
        {
            onSuccess: (token) => {
                setToken(token);
                queryClient.invalidateQueries('token');
            },
        }
    );

    const handleGoogleLoginSuccess = async (credentialResponse: any) => {
        try {
            await loginGoogleMutation.mutateAsync(credentialResponse.credential);

        } catch (error) {
            console.error('Login failed', error);
            toast.error('Google login failed')
        }
    };

    const handleGoogleLoginFailure = () => {
        toast.error('Google login failed')
    };


    return (
        <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                <h2 style={{ color: "#19647e" }}>Sign In</h2>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                // InputProps={{
                //     startAdornment: ,
                // }}
                />
                <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    margin="normal"
                    variant="outlined"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                // InputProps={{
                //     startAdornment: <Lock />,
                // }}
                />
                {error && (<p style={{color:"red"}}>Incorrect username or password, please try again.</p>)}
                <Button type="submit" variant="contained" fullWidth disabled={loginMutation.isLoading}>
                    {loginMutation.isLoading ? 'Logging in...' : 'Log In'}
                </Button>

                <div>
                    <GoogleOAuthProvider clientId="467660409519-3nt1qb60337hlr9esafd9gg4qspukq9k.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginFailure}
                        />
                    </GoogleOAuthProvider>
                </div>
            </form>
        </Container>
    )
}