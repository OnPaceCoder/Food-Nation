import { useEffect, useState } from 'react';
import { Table, Pagination, Center, Container } from '@mantine/core';
import { toast } from 'react-toastify';

import Tabular from '../../components/ui/Tabular';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    let limit = 6;

    const fetchUsers = async () => {
        setLoading(true);
        try {

            const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/users?page=${page}&limit=${limit}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();

            setTotalPages(data.totalPages);
            setUsers(data.docs);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
        setLoading(false);
    };


    const columns = [
        { label: 'ID', accessor: '_id' },
        { label: 'Username', accessor: 'username' },
        { label: 'Is Admin', accessor: 'isAdmin' },
        { label: 'Account Created', accessor: 'createdAt' },
    ];

    const formatCell = (accessor, value) => {
        if (accessor === 'createdAt') {
            return new Date(value).toLocaleDateString();
        }
        if (accessor === 'isAdmin') {
            return value ? 'Yes' : 'No';
        }
        if (accessor === '_id') {
            return value.slice(-4);

        }
        return value;
    };

    return (
        <Container style={{ marginTop: '-30px' }}>
            <h1>All Users</h1>
            <Tabular
                scrolled={scrolled}
                setScrolled={setScrolled}
                columns={columns}
                formatCell={formatCell}
                data={users}
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
    );
};

export default ViewUsers;
