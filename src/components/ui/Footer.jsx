
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconCheese } from '@tabler/icons-react';
import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import classes from './Footer.module.css';

const Footer = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <footer style={{ display: isLandingPage ? 'none' : 'block' }}>
            <div className={classes.footer}>
                <div className={classes.inner}>
                    <Group>
                        <IconCheese size={40} />
                        <Text fw={900} size="lg">
                            Food Nation
                        </Text>
                    </Group>


                    <div className={classes.links}>

                        <Text size="sm" fs="italic" c="dimmed" >

                            Terms and Conditions

                        </Text>
                    </div>

                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandTwitter size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandYoutube size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandInstagram size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </div>
            </div>
        </footer>
    )
}

export default Footer

