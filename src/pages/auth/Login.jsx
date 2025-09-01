import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm'
import { Anchor, Container, Text, Title } from '@mantine/core'

const Login = () => {
    return (
        <Container>

            <Title ta="center" >
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component={Link} to="/register">
                    Create account
                </Anchor>
            </Text>
            <LoginForm />
        </Container>

    )
}

export default Login