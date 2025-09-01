
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import Footer from './Footer';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();
    console.log(isLoggedIn + '888888')
    const role = JSON.parse(sessionStorage.getItem('role'));


    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    if (role && 'isAdmin' !== role) {
        return <Navigate to="/" />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ToastContainer />
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );

}

export default ProtectedRoute