import { useEffect, useState } from 'react';
import { Container, Grid, Pagination, Loader, Center } from '@mantine/core';
import { toast } from 'react-toastify'
import CategoryCard from '../../components/category/CategoryCard';

const Category = () => {
    const [category, setCategory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const limit = 3;

    const fetchCategory = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/category?page=${page}&limit=${limit}`);
            if (!response.ok) {
                toast.error("Failed to fetch category")
            }

            const data = await response.json();
            setCategory(data.docs);
            setTotalPages(data.totalPages);
            console.log(data)
            // setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch category")
            console.error('Failed to fetch category:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategory(page);
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
                {category.map((cat) => (
                    <Grid.Col
                        key={cat._id}
                        span={{ xs: 8, sm: 8, md: 6, lg: 4 }}
                    >
                        <CategoryCard category={cat} />
                    </Grid.Col>
                ))}
            </Grid>

            <Center pt="8em">
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
    )
}

export default Category


