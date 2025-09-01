import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container, Center, Pagination, Button, Modal, TextInput, Textarea, Group } from '@mantine/core';
import Tabular from '../../components/ui/Tabular';

const ViewCategory = () => {

    //View Category States
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [editErrors, setEditErrors] = useState({})

    // Add Category States 
    const [newCategory, setNewCategory] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [modalOpened, setModalOpened] = useState(false);


    //Update Category States
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [editCategory, setEditCategory] = useState({
        id: '',
        name: '',
        description: '',
        image: '',
    });


    useEffect(() => {
        fetchCategories();
    }, [page]);


    useEffect(() => {
        if (modalOpened) {
            setFormErrors({});
        }

    }, [modalOpened,])

    const limit = 6;
    const columns = [
        { accessor: '_id', label: 'ID' },
        { accessor: 'image', label: "Image" },
        { accessor: 'name', label: 'Category Name' },
        { accessor: 'description', label: "Description" },
        { accessor: 'createdAt', label: 'Created At' },
    ];

    //Function to fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category?page=${page}&limit=${limit}`, { credentials: 'include' });
            if (!response.ok) toast.error("Failed to fetch category");
            const data = await response.json();

            setCategories(data.docs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch categories');
        }
        setLoading(false);
    };

    //Function to format cell of a table
    const formatCell = (accessor, value, row) => {
        if (accessor === 'createdAt') {
            return new Date(value).toLocaleDateString();
        } if (accessor === 'image') {
            return <img src={value} alt="Product" style={{ width: '50px', height: '50px' }} />;
        }
        if (accessor === '_id') {
            return (
                <Button variant="subtle" onClick={() => { handleRowClick(row) }}>
                    {value.slice(-4)}
                </Button>
            );
        }
        return value;
    };

    //Function to handle Add Category
    const handleAddCategory = async () => {

        const errors = {}
        if (!newCategory.trim()) {
            errors.name = 'Category name is required';
        }

        if (!newCategory.trim()) {
            errors.image = 'Image URL is required';
        }
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ name: newCategory, description: newDescription, image: newImage, }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Category added successfully');
            fetchCategories();
            setNewCategory('');
            setNewImage('');
            setNewDescription('');
            setModalOpened(false);
        }
    };

    const handleRowClick = (category) => {
        setEditCategory({
            id: category._id,
            name: category.name,
            description: category.description || '',
            image: category.image || '',
        });
        setEditErrors({});
        setEditModalOpened(true);
    };

    //Function to update Category
    const handleUpdateCategory = async () => {
        const errors = {};
        if (!editCategory.name.trim()) errors.name = 'Name is required';
        if (!editCategory.image.trim())
            errors.image = 'Valid image URL is required';

        setEditErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/${editCategory.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                name: editCategory.name,
                description: editCategory.description,
                image: editCategory.image,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Category updated successfully');
            fetchCategories();
            setEditModalOpened(false);
        } else {
            toast.error('Failed to update category');
        }
    };

    //Function to delete Category
    const handleDeleteCategory = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/${editCategory.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Category deleted successfully');
            fetchCategories();
            setEditModalOpened(false);
        } else {
            toast.error('Failed to delete category');
        }
    };

    return (
        <Container style={{ marginTop: '-30px' }}>
            <h1>All Categories</h1>
            <Button onClick={() => { setModalOpened(true) }} my={"lg"} >Add Category</Button>

            {/* Table for viewing all the categories */}
            <Tabular
                scrolled={scrolled}
                setScrolled={setScrolled}
                data={categories}
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

            {/* Modal for Adding the Category */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Add New Category"
                centered
            >
                <TextInput
                    label="Category Name"
                    placeholder="Enter category name"
                    value={newCategory}
                    error={formErrors.name}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    mb="md"
                />

                <Textarea
                    label="Category Description"
                    placeholder="Enter category description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    minRows={3}
                />
                <TextInput
                    label="Image Link"
                    placeholder="Enter image URL"
                    value={newImage}
                    error={formErrors.image}
                    onChange={(e) => setNewImage(e.target.value)}
                    required
                    mb="md"
                />
                <Group position="right" mt="md">
                    <Button variant="default" onClick={() => setModalOpened(false)}>Cancel</Button>
                    <Button onClick={handleAddCategory}>Save</Button>
                </Group>
            </Modal>

            {/* Modal for Updating and Deleting the Category */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Category"
                centered
            >
                <TextInput
                    label="Category Name"
                    placeholder="Enter category name"
                    value={editCategory.name}
                    error={editErrors.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    required
                    mb="md"
                />

                <TextInput
                    label="Image Link"
                    placeholder="Enter image URL"
                    value={editCategory.image}
                    error={editErrors.image}
                    onChange={(e) => setEditCategory({ ...editCategory, image: e.target.value })}
                    required
                    mb="md"
                />

                <Textarea
                    label="Category Description"
                    placeholder="Enter category description"
                    value={editCategory.description}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    minRows={3}
                />

                <Group position="right" mt="md">
                    <Button variant="default" onClick={() => setEditModalOpened(false)}>Cancel</Button>
                    <Button onClick={handleUpdateCategory}>Update</Button>
                    <Button onClick={handleDeleteCategory} color='red'>Delete</Button>
                </Group>
            </Modal>

        </Container>
    );
};

export default ViewCategory;
