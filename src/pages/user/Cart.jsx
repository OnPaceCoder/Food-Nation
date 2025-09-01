import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Button, Loader, Center } from '@mantine/core';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();


    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (cartItems) => {
        let total = 0;
        cartItems.forEach(item => {
            total += parseFloat(item.price);
        });
        setTotalAmount(parseFloat(total.toFixed(2)));
    };
    const handleOrder = async () => {
        if (!isLoggedIn) {
            toast.error("Please log in to place an order");
            navigate('/login');
            return;
        }

        setLoading(true);

        // Create the order object
        const orderData = {
            products: cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/orders', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                toast.error("Failed to place order");
                return;
            }

            // const data = await response.json();
            toast.success("Order placed successfully");
            localStorage.removeItem('cart');
            navigate(`/orders`);
        } catch (error) {
            toast.error("Failed to place order");
            console.error('Error placing order:', error);
        }

        setLoading(false);
    };

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    if (loading) {
        return (
            <Center mt="xl">
                <Loader />
            </Center>
        );
    }

    return (
        <Container  >
            <Text align="center" size="xl" weight={500}>Your Cart</Text>
            <Grid gutter="lg" mt="md">
                {cart.length === 0 ? (
                    <Center>
                        <Text>No items in the cart</Text>
                    </Center>
                ) : (
                    cart.map((item) => (
                        <Grid.Col key={item._id} span={12} sm={6} md={4}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>

                                <Text weight={500} size="lg">{item.name}</Text>
                                <Text size="sm" color="dimmed">{item.description}</Text>
                                <Text weight={700} size="md">Price: ${item.price}</Text>
                                <Text weight={700} size="md">Quantity: {item.quantity}</Text>
                                <Button color="red" variant="light" onClick={() => handleRemoveFromCart(item._id)}>
                                    Remove
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))
                )}
            </Grid>

            <Text align="right" size="xl" weight={700} mt="md">
                Total: ${totalAmount.toFixed(2)}
            </Text>

            <Center mt="md">
                <Button color="blue" onClick={handleOrder} disabled={cart.length === 0}>
                    Place Order
                </Button>
            </Center>
        </Container>
    );
};

export default CartPage;
