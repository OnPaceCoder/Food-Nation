
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container, Center, Pagination, Badge, Button } from '@mantine/core';
import Tabular from '../../components/ui/Tabular';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const limit = 6;

    const columns = [
        { accessor: '_id', label: 'ID' },
        { accessor: 'username', label: 'Username' },
        { accessor: 'productsList', label: 'Products' },
        { accessor: 'totalAmount', label: 'Total Amount' },
        { accessor: 'status', label: 'Order Status' },
        { accessor: 'createdAt', label: 'Created At' },
    ];

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders?page=${page}&limit=${limit}`, { credentials: 'include' });
            if (!response.ok) toast.error("Failed to fetch orders");
            const data = await response.json();

            const formattedOrders = data.docs.map((order) => ({
                ...order,
                username: order.user?.username || 'N/A',
                productsList: order.products
                    .map(p => p.product ? `${p.product.name} (x${p.quantity})` : `Deleted Product (x${p.quantity})`)
                    .join(', '),

                createdAt: new Date(order.createdAt).toLocaleDateString(),
                totalAmount: `$${order.totalAmount.toFixed(2)}`,
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            }));


            setOrders(formattedOrders);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch categories');
        }
        setLoading(false);
    };


    const formatCell = (accessor, value) => {
        if (accessor === '_id') {
            return (

                <Button variant="subtle" component={Link} to={`/dashboard/orders/${value}`}>
                    {value.slice(-4)}
                </Button>
            );


        }
        if (accessor === 'status') {
            return <Badge color={value === 'Pending' ? 'yellow' : value === "Cancelled" ? 'red' : 'green'}>{value}</Badge>
        }

        else {
            return value;
        }
    };


    return (
        <Container style={{ marginTop: '-30px' }}>
            <h1>All Orders</h1>
            <Tabular
                scrolled={scrolled}
                setScrolled={setScrolled}
                data={orders}
                columns={columns}
                formatCell={formatCell}
            />
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
        </Container>
    )
}

export default Dashboard