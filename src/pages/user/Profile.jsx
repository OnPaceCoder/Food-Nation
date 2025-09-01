import { TextInput, PasswordInput, Button, Group, Card, Title, Text, Grid, Container } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formValues, setFormValues] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});



    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormValues((prev) => ({ ...prev, username: data.username }));
            }
        };
        fetchUser();
    }, []);


    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };


    const handleUpdate = async () => {
        const validationErrors = {};
        if (!formValues.username.trim()) validationErrors.username = 'Username is required';
        if (formValues.password && formValues.password.length < 6) validationErrors.password = 'Password must be at least 6 characters';

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;



        const updateData = { username: formValues.username };

        if (formValues.password) {
            updateData.password = formValues.password;
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        if (res.ok) {
            toast.success('Profile updated successfully');
            setFormValues((prev) => ({ ...prev, password: '' }));
        } else {
            toast.error('Failed to update profile');
        }
    };


    return (
        <div>


            <Container size="sm" mt="xl">
                <Grid gutter="md">
                    <Grid.Col span={12} sm={8} md={6}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={2} align="center" mb="md">
                                Profile
                            </Title>
                            <Text size="sm" align="center" mb="md">
                                You can update your profile information
                            </Text>

                            <TextInput
                                label="Username"
                                name="username"
                                value={formValues.username}
                                onChange={handleChange}
                                error={errors.username}
                                required
                                mb="md"
                            />

                            <PasswordInput
                                label="New Password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Leave blank to keep current password"
                                mb="md"
                            />

                            <Group position="right" mt="md">
                                <Button onClick={handleUpdate}>Update</Button>

                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    )
}

export default Profile