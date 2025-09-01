import React from 'react'
import RegisterForm from '../../components/auth/RegisterForm'
import { Link } from 'react-router-dom';
import { Anchor, Container, Text, Title } from '@mantine/core'


const Register = () => {
    return (
        <div>
            <Container >

                <Title ta="center" >
                    Register Now!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have an account?{' '}
                    <Anchor size="sm" component={Link} to="/login">
                        Login account
                    </Anchor>
                </Text>

                <RegisterForm />
            </Container>

        </div>
    )
}

export default Register