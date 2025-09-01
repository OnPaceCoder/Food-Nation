import {
    Button,
    Container,
    Paper,
    PasswordInput,
    TextInput,
} from '@mantine/core';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
// import classes from './AuthenticationTitle.module.css';
import { useAuth } from '../../context/AuthContext';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();


            if (response.ok) {
                toast.success('Login successful!');
                const token = data.token;
                const role = data.role;
                login(token, role)
                navigate("/");
            } else {

                if (data.errors) {
                    const fieldErrors = {};
                    data.errors.forEach((err) => {
                        fieldErrors[err.path] = err.msg;
                    });
                    setErrors(fieldErrors);
                } else if (data.error) {
                    setPassword("");
                    setUsername("");
                    toast.error(data.error)
                }
            }
        } catch (err) {
            toast.error("Server Error! Please try again later", + err)
        }
    };


    return (
        <Container size={420} >
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Username" placeholder="John Doe" required value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

                <Button fullWidth mt="xl" onClick={handleRegister}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    )
}

export default LoginForm





