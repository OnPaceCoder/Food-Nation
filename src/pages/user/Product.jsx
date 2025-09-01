import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Image, Text, Container, LoadingOverlay, NumberInput } from '@mantine/core';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    //Fetching Single Product
    const fetchProduct = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
            const data = await response.json();
            setProduct(data.product);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    //Adding product to localStorage (cart)
    const handleAddToCart = () => {

        if (!isLoggedIn) {
            navigate('/login');
        } else {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartProduct = {
                _id: product._id,
                name: product.name,
                price: (product.price * quantity).toFixed(2),
                quantity: quantity,
            };

            const existingProductIndex = cart.findIndex((item) => item._id === product._id);
            if (existingProductIndex >= 0) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(cartProduct);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            toast.success('Product added to cart!');
        }
    };

    if (loading) {
        return <LoadingOverlay visible={true} />;
    }

    if (!product) {
        return <Text>No product found</Text>;
    }

    return (
        <Container style={{ marginTop: '-85px', marginBottom: '-85px' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                        src={product.image}
                        height={400}
                        alt={product.name}
                        fit="contain"
                    />
                </Card.Section>

                <Text weight={500} size="xl" mt="md">
                    {product.name}
                </Text>

                <Text size="md" color="dimmed" mt="xs">
                    {product.description || 'No description available'}
                </Text>

                <Text weight={700} size="xl" mt="md">
                    ${product.price}
                </Text>
                <NumberInput
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={99}
                    step={1}
                    label="Quantity"
                    mt="md"
                    style={{ width: '100%' }}
                />

                <Button
                    fullWidth
                    mt="md"
                    radius="md"
                    onClick={handleAddToCart}
                    variant="light"
                    color="blue"
                >
                    Add to Cart
                </Button>
            </Card>
        </Container>
    );

}

export default Product

