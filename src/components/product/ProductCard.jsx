import { Card, Text, Image, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleViewProduct = () => {
        if (product?._id) {
            navigate(`/products/${product._id}`);
        } else {
            console.error('Product ID is missing');
        }
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={product.image}
                    height={160}
                    alt={product.name}
                    fit="cover"
                />
            </Card.Section>

            <Text weight={500} size="lg" mt="md">
                {product.name}
            </Text>

            <Text size="sm" color="dimmed" mt="xs">
                {product.description?.slice(0, 60) || 'No description available'}
            </Text>

            <Text weight={700} size="md" mt="md">
                ${product.price}
            </Text>
            <Button
                fullWidth
                mt="md"
                radius="md"
                onClick={handleViewProduct}
                variant="light"
                color="blue"
            >
                View Product
            </Button>
        </Card>
    );
};

export default ProductCard;
