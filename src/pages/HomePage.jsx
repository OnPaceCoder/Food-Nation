import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Title, Button, Grid, Card, Text, Image, Center } from '@mantine/core';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/category/CategoryCard';
import classes from '../components/ui/Footer.module.css'

import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconCheese } from '@tabler/icons-react';
import { ActionIcon, Anchor, Group, } from '@mantine/core';

const HomePage = () => {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        // Fetch products
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?page=1`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setProducts(data.docs);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, {
                    credentials: 'include',
                });
                const data = await res.json();
                setCategories(data.docs);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);
    return (
        <div style={{ position: 'relative', width: '100%', height: '60vh' }}>
            <img
                src="http://foodiesfeed.com/wp-content/uploads/2024/01/best-burger-in-town.jpg"
                alt="Delicious food"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontSize: '3rem' }}>Welcome to Our Food Paradise</h1>
                <p style={{ fontSize: '1.5rem' }}>Delicious food, just a click away!</p>
            </div>
            {/*Products */}
            <Container style={{ marginTop: '120px' }} >
                <Title order={2} mb="md">Popular Products</Title>

                <Grid gutter="lg" justify="center">
                    {products.slice(3, 6).map((product) => (

                        <Grid.Col
                            key={product._id}
                            span={{ xs: 8, sm: 8, md: 6, lg: 4 }}
                        >

                            <ProductCard product={product} />
                        </Grid.Col>
                    ))}
                </Grid>
                <Center mb="xl" p="lg">
                    <Button onClick={() => navigate('/products')} variant="light">View All Products</Button>
                </Center>
            </Container>

            {/*Categories */}
            <Container style={{ marginTop: '30px' }} >
                <Title order={2} mb="md">Categories</Title>
                <Grid gutter="lg" justify="center">
                    {categories.slice(1, 4).map((cat) => (
                        <Grid.Col
                            key={cat._id}
                            span={{ xs: 8, sm: 8, md: 6, lg: 4 }}
                        >
                            <CategoryCard category={cat} />
                        </Grid.Col>
                    ))}
                </Grid>
                <Center p="lg">
                    <Button onClick={() => navigate('/category')} variant="light">View All Categories</Button>
                </Center>
            </Container>

            <footer>
                <div className={classes.footer}>
                    <div className={classes.inner}>
                        <Group>
                            <IconCheese size={40} />
                            <Text fw={900} size="lg">
                                Food Nation
                            </Text>
                        </Group>


                        <div className={classes.links}>

                            <Text size="sm" fs="italic" c="dimmed" >

                                Terms and Conditions

                            </Text>
                        </div>

                        <Group gap="xs" justify="flex-end" wrap="nowrap">
                            <ActionIcon size="lg" variant="default" radius="xl">
                                <IconBrandTwitter size={18} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon size="lg" variant="default" radius="xl">
                                <IconBrandYoutube size={18} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon size="lg" variant="default" radius="xl">
                                <IconBrandInstagram size={18} stroke={1.5} />
                            </ActionIcon>
                        </Group>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage