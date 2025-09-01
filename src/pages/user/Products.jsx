import { useEffect, useState } from 'react';
import { Container, Grid, Pagination, Loader, Center } from '@mantine/core';
import { toast } from 'react-toastify'
import ProductCard from '../../components/product/ProductCard';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const limit = 6;

    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/products?page=${page}&limit=${limit}`);
            if (!response.ok) {
                toast.error("Failed to fetch products")
            }

            const data = await response.json();
            setProducts(data.docs);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch products")
            console.error('Failed to fetch products:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    if (loading) {
        return (
            <Center mt="xl">
                <Loader />
            </Center>
        );
    }

    return (
        <Container style={{ marginTop: '-30px' }} >
            <Grid gutter="lg" justify="center">
                {products.map((product) => (
                    <Grid.Col
                        key={product._id}
                        span={{ xs: 8, sm: 8, md: 6, lg: 4 }}
                    >
                        <ProductCard product={product} />
                    </Grid.Col>
                ))}
            </Grid>

            <Center pt="xl">
                <Pagination
                    value={page}
                    onChange={setPage}
                    total={totalPages}
                    disabled={loading}
                    withEdges
                    size="md"
                    radius="md"
                />
            </Center>
        </Container >

    );
};


export default Product;
