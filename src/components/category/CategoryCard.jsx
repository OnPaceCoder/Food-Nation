import { Card, Text, Image, Button } from '@mantine/core';


const CategoryCard = ({ category }) => {
    console.log(category)
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={category.image}
                    height={160}
                    alt={category.name}
                />
            </Card.Section>

            <Text weight={500} size="lg" mt="md">
                {category.name}
            </Text>

            <Text size="sm" color="dimmed" mt="xs">
                {category.description?.slice(0, 60) || 'No description available'}
            </Text>


        </Card>
    );
};

export default CategoryCard;
