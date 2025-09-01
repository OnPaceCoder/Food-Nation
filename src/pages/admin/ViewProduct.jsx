import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container, Center, Pagination, Button, Modal, TextInput, Textarea, Group } from '@mantine/core';
import Tabular from '../../components/ui/Tabular';

const ViewProduct = () => {

    //View Product States
    const [product, setProduct] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [editErrors, setEditErrors] = useState({})


    //Add Products States
    const [newProduct, setNewProduct] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newStocks, setNewStocks] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newImage, setNewImage] = useState('');
    const [modalOpened, setModalOpened] = useState(false);


    //Update Product States
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [editProduct, setEditProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        category: '',
        stocks: '',
        image: '',
    });

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        if (modalOpened) {
            setFormErrors({});
        }

    }, [modalOpened,]);

    const limit = 6;

    const columns = [
        { accessor: '_id', label: 'ID' },
        { accessor: 'image', label: 'Image' },
        { accessor: 'name', label: 'Product Name' },
        { accessor: 'description', label: 'Product Description' },
        { accessor: 'createdAt', label: 'Created At' },
        { accessor: 'category', label: 'Category' },
        { accessor: 'price', label: 'Price' },
        { accessor: 'stocks', label: 'Stocks' }
    ];

    //Function to fetch all the products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?page=${page}&limit=${limit}`, { credentials: 'include' });
            if (!response.ok) toast.error("Failed to fetch Products");
            const data = await response.json();

            setProduct(data.docs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch Products');
        }
        setLoading(false);
    };

    //Function to format cell of a table
    const formatCell = (accessor, value, row) => {
        if (accessor === 'createdAt') {
            return new Date(value).toLocaleDateString();
        }
        if (accessor === 'price') {
            return `$${value}`;

        }
        if (accessor === 'image') {
            return <img src={value} alt="Product" style={{ width: '50px', height: '50px' }} />;

        }
        if (accessor === 'category') {
            return value?.name || 'N/A';

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

    //Function to handle Add Product
    const handleAddProduct = async () => {

        const errors = {};

        if (!newProduct.trim()) errors.name = 'Product name is required';
        if (!newImage.trim())
            errors.image = 'Valid image URL is required';
        if (!newCategory.trim()) errors.category = 'Category is required';
        if (!newPrice || isNaN(newPrice) || Number(newPrice) <= 0)
            errors.price = 'Valid price is required';
        if (!newStocks || !Number.isInteger(+newStocks) || Number(newStocks) < 0)
            errors.stocks = 'Stock must be a non-negative integer';

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;


        if (!newProduct.trim() || !newImage.trim() || !newDescription || !newStocks || !newPrice) return;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ name: newProduct, description: newDescription, price: newPrice, stocks: newStocks, image: newImage, category: newCategory }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Product added successfully');
            fetchProducts();
            setNewProduct('');
            setNewImage('');
            setNewDescription('');
            setNewPrice('');
            setNewCategory('');
            setNewStocks('');
        }
    };

    const handleRowClick = (product) => {
        setEditProduct({
            id: product._id,
            name: product.name,
            description: product.description || '',
            price: product.price || '',
            category: product.category?.name || '',
            stocks: product.stocks || '',
            image: product.image || '',
        });
        setEditErrors({});
        setEditModalOpened(true);
    };

    //Function to update Product
    const handleUpdateProduct = async () => {
        const errors = {};
        if (!editProduct.name.trim()) errors.name = 'Name is required';
        if (!editProduct.price || isNaN(editProduct.price)) errors.price = 'Valid price required';
        if (!editProduct.image.trim())
            errors.image = 'Valid image URL is required';
        if (!editProduct.category.trim()) errors.category = 'Category is required'
        if (!editProduct.price || isNaN(editProduct.price) || Number(editProduct.price) <= 0) errors.price = 'Valid price is required'

        if (editProduct.stocks === '') {
            errors.stocks = 'Stock is required';
        }

        setEditErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${editProduct.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price,
                stocks: editProduct.stocks,
                category: editProduct.category,
                image: editProduct.image,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Product updated successfully');
            fetchProducts();
            setEditModalOpened(false);
        } else {
            toast.error('Failed to update product');
        }
    };


    //Function to delete Product
    const handleDeleteProduct = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${editProduct.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success('Product deleted successfully');
            fetchProducts();
            setEditModalOpened(false);
        } else {
            toast.error('Failed to delete product');
        }
    };

    return (
        <Container style={{ marginTop: '-30px' }}>
            <h1>All Products</h1>
            <Button onClick={() => { setModalOpened(true) }} my={"lg"} >Add Products</Button>
            {/* Table for viewing all the Products */}
            <Tabular
                scrolled={scrolled}
                setScrolled={setScrolled}
                data={product}
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

            {/* Modal for adding the product */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Add New Product"
                centered
            >
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    value={newProduct}
                    error={formErrors.name}
                    onChange={(e) => setNewProduct(e.target.value)}
                    required
                    mb="md"
                />

                <Textarea
                    label="Product Description"
                    placeholder="Enter product description"
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
                <TextInput
                    label="Category"
                    placeholder="Enter product's Category"
                    value={newCategory}
                    error={formErrors.category}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    mb="md"
                />
                <TextInput

                    label="Price"
                    placeholder="Enter product price"
                    value={newPrice}
                    error={formErrors.price}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    mb="md"
                />
                <TextInput
                    type='number'
                    label="Stocks"
                    placeholder="Enter product stock"
                    value={newStocks}
                    error={formErrors.stocks}
                    onChange={(e) => setNewStocks(e.target.value)}
                    required
                    mb="md"
                />
                <Group position="right" mt="md">
                    <Button variant="default" onClick={() => setModalOpened(false)}>Cancel</Button>
                    <Button onClick={handleAddProduct}>Save</Button>
                </Group>
            </Modal>

            {/* Modal for Updating and Deleting the Product */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Product"
                centered
            >
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    value={editProduct.name}
                    error={editErrors.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    required
                    mb="md"
                />

                <Textarea
                    label="Product Description"
                    placeholder="Enter category description"
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    minRows={3}
                />

                <TextInput
                    label="Image Link"
                    placeholder="Enter image URL"
                    value={editProduct.image}
                    error={editErrors.image}
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                    required
                    mb="md"
                />
                <TextInput
                    label="Category"
                    placeholder="Enter product's Category"
                    value={editProduct.category}
                    error={editErrors.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    required
                    mb="md"
                />

                <TextInput
                    label="Price"
                    placeholder="Enter product price"
                    value={editProduct.price}
                    error={editErrors.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    required
                    mb="md"
                />

                <TextInput
                    type='number'
                    label="Stocks"
                    placeholder="Enter product stocks"
                    value={editProduct.stocks}
                    error={editErrors.stocks}
                    onChange={(e) => setEditProduct({ ...editProduct, stocks: e.target.value })}
                    required
                    mb="md"
                />

                <Group position="right" mt="md">
                    <Button variant="default" onClick={() => setEditModalOpened(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProduct}>Update</Button>
                    <Button onClick={handleDeleteProduct} color='red'>Delete</Button>
                </Group>
            </Modal>

        </Container>
    );
};

export default ViewProduct;
