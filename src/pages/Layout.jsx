import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import Header from '../components/ui/Header'
import Footer from '../components/ui/Footer'
import 'react-toastify/dist/ReactToastify.css';


const Layout = () => {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <ToastContainer />
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout