import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Text, Title, Divider, Group, Badge, Select, Button, Loader, Container } from '@mantine/core';
import { toast } from 'react-toastify';

const UpdateOrder = () => {
    const { id } = useParams();
    // const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}`, { credentials: 'include' });
            const data = await response.json();
            setOrder(data);
            setNewStatus(data.status); // set initial status
        };

        fetchOrder();
    }, [id,]);

    const handleStatusUpdate = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedOrder = await response.json();
            setOrder((prevOrder) => ({
                ...prevOrder,
                status: updatedOrder.status, // only replace the status
            }));
            toast.success('Order status updated!');
        } catch (error) {
            console.error(error);
            toast.error('Error updating order status');
        } finally {
            setLoading(false);
        }
    };

    if (!order) return (
        <Group position="center" mt="xl">
            <Loader />
        </Group>
    );

    return (
        <Container size="sm" px="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Card shadow="md" padding="lg" radius="md" withBorder style={{ maxWidth: '620px', margin: '2rem auto' }} >
                <Title order={2} mb="md">Order Details</Title>

                <Text><strong>Order ID:</strong> {order._id}</Text>
                <Text><strong>Username:</strong> {order.user?.username || 'N/A'}</Text>
                <Text><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</Text>
                <Group spacing="sm" align="center" mt="sm">
                    <Text><strong>Status:</strong></Text>
                    <Badge color={order.status === 'Delivered' ? 'green' : order.status === 'Cancelled' ? 'red' : 'yellow'}>{order.status}</Badge>
                </Group>
                <Text mt="sm"><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</Text>

                <Divider my="md" />

                <Title order={4} mb="sm">Products</Title>
                {order.products.map((p, index) => (
                    <Card key={p._id || index} shadow="xs" padding="sm" radius="md" withBorder my="xs">
                        <Text><strong>Product:</strong> {p.product?.name || 'Deleted Product'}</Text>
                        <Text>
                            <strong>Price:</strong>{' '}
                            {p.product?.price !== undefined
                                ? `$${p.product.price.toFixed(2)}`
                                : 'N/A'}
                        </Text>
                        <Text><strong>Quantity:</strong> {p.quantity}</Text>
                    </Card>
                ))}
                <Divider my="md" />

                <Title order={4} mb="sm">Update Status</Title>
                <Select
                    value={newStatus}
                    onChange={setNewStatus}
                    data={['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']}
                    placeholder="Select new status"
                    mb="md"
                />
                <Button onClick={handleStatusUpdate} loading={loading} fullWidth color="blue" variant='light'>
                    Update Status
                </Button>
            </Card>
        </Container>
    );
};

export default UpdateOrder;
