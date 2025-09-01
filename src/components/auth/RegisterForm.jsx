import { useNavigate } from 'react-router-dom';
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { toast } from 'react-toastify'
import { useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

const RegisterForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();


            if (response.ok) {
                toast.success("Successfully logged in")
                navigate("/login");
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

            toast.error('Server error. Please try again.', err)
            console.error(err);
        }
    };


    return (

        <Container size={420} my={80}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Username" placeholder="John Doe" required value={username} onChange={(e) => setUsername(e.target.value)}
                    error={errors.username} />

                <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
                <Button fullWidth mt="xl" onClick={handleRegister}>
                    Register
                </Button>
            </Paper>
        </Container>
    )
};
export default RegisterForm