import { toast } from 'react-toastify';
import {
    IconCheese,
} from '@tabler/icons-react';
import {
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    ScrollArea,
    Text,
    Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import classes from './Header.module.css';
import { useAuth } from '../../context/AuthContext';


const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const { isLoggedIn, logout } = useAuth();
    const isLandingPage = location.pathname === '/';
    const role = JSON.parse(sessionStorage.getItem('role'));
    const handleLogout = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/logout", {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                toast.success('Logged out successfully');

                logout()
                navigate('/');
            } else {
                toast.error('Logout failed')
            }
        } catch (error) {
            toast.error('Logout error:', error)

        }
    }

    return (
        <Box pb={isLandingPage ? 0 : 120}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">

                    <Group>
                        <IconCheese size={40} />

                        <Text fw={900} size="lg">
                            Food Nation
                        </Text>


                    </Group>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link to="/" className={classes.link} >
                            Home
                        </Link>
                        <Link to="/products" className={classes.link}>
                            Product
                        </Link>
                        <Link to="/category" className={classes.link}>
                            Category
                        </Link>
                        <Link to="/cart" className={classes.link}>
                            Cart
                        </Link>
                        {isLoggedIn && (

                            <Link to="/orders" className={classes.link}>
                                Orders
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link to="/profile" className={classes.link}>
                                Profile
                            </Link>
                        )}
                        {
                            role && (

                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <Link className={classes.link}>
                                            Dashboard
                                        </Link>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item component={Link} to="/dashboard">
                                            Orders
                                        </Menu.Item>
                                        <Menu.Item component={Link} to="/dashboard/product">
                                            Products
                                        </Menu.Item>
                                        <Menu.Item component={Link} to="/dashboard/category">
                                            Category
                                        </Menu.Item>
                                        <Menu.Item component={Link} to="/dashboard/users">
                                            Users
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )
                        }

                    </Group>

                    <Group visibleFrom="sm">

                        {isLoggedIn ? (
                            <Button variant="default" onClick={handleLogout}>Logout</Button>
                        ) : (
                            <>
                                <Button variant="default" component={Link} to='/login'>Log in</Button>
                                <Button component={Link} to='/register'>Register</Button>
                            </>
                        )}

                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />

                    <Link to="/" className={classes.link}>
                        Home
                    </Link>

                    <Link to="/products" className={classes.link}>
                        Product
                    </Link>
                    <Link to="/category" className={classes.link}>
                        Category
                    </Link>
                    <Link to="/cart" className={classes.link}>
                        Cart
                    </Link>
                    {isLoggedIn && (
                        <Link to="/orders" className={classes.link}>
                            Orders
                        </Link>
                    )}
                    {
                        role && (
                            <Link to="/dashboard" className={classes.link}>
                                Dashboard
                            </Link>
                        )
                    }
                    <Link to="/profile" className={classes.link}>
                        Profile
                    </Link>
                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        {isLoggedIn ? (
                            <Button variant="default" onClick={handleLogout}>Logout</Button>
                        ) : (
                            <>
                                <Button variant="default" component={Link} to='/login'>Log in</Button>
                                <Button component={Link} to='/register'>Register</Button>
                            </>
                        )}
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    )
}

export default Header



