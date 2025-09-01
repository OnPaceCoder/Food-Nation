import { useEffect, useState } from 'react';
import { Container, Card, Text, Title, Loader, Center, Group, Badge } from '@mantine/core';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error("Please log in to view your orders");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/orders/myorders', {
                credentials: 'include',
                method: "GET"
            });

            if (!response.ok) {
                toast.error("Failed to fetch orders");
                return;
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error('Error fetching orders:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Center mt="xl">
                <Loader />
            </Center>
        );
    }
    return (
        <Container mt="xl">
            <Title order={2} mb="md">My Orders</Title>

            {orders.length === 0 ? (
                <Text>No orders found.</Text>
            ) : (
                orders.map(order => (
                    <Card key={order._id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
                        <Group justify="space-between" mb="sm">
                            <Text fw={600}>Order ID: {order._id}</Text>
                            <Badge color={order.status === 'Pending' ? 'yellow' : order.status === "Cancelled" ? 'red' : 'green'}>
                                {order.status}
                            </Badge>
                        </Group>

                        <Text size="sm" color="dimmed">Placed on: {new Date(order.createdAt).toLocaleString()}</Text>

                        <Title order={4} mt="md" mb="xs">Products:</Title>
                        {order.products.map((item, index) => (
                            item.product ? (
                                <Text key={index}>
                                    {item.product.name} - {item.quantity} x ${item.product.price}
                                </Text>
                            ) : (
                                <Text key={index} color="red">
                                    Product no longer exists
                                </Text>
                            )
                        ))}

                        <Text fw={700} mt="md">
                            Total Amount: ${order.totalAmount}
                        </Text>
                    </Card>
                ))
            )}
        </Container>
    )
}

export default OrderHistory


