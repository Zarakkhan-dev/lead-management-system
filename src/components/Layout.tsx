import type { ReactNode } from 'react';
import { Box, Flex, Link, HStack, Heading, Spacer, Button, useColorModeValue, Container } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Flex
        as="header"
        position="fixed"
        w="full"
        bg={bgColor}
        borderBottom="1px"
        borderBottomColor={borderColor}
        py={4}
        px={8}
        zIndex={10}
      >
        <Flex align="center" mr={8}>
          <Heading as="h1" size="lg" letterSpacing="tight">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              Lead Manager
            </Link>
          </Heading>
        </Flex>

        {user && (
          <HStack spacing={4} mr={4}>
            <Link as={RouterLink} to="/" fontWeight="medium" _hover={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link as={RouterLink} to="/leads" fontWeight="medium" _hover={{ textDecoration: 'none' }}>
              Leads
            </Link>
            <Link as={RouterLink} to="/leads/new" fontWeight="medium" _hover={{ textDecoration: 'none' }}>
              Add Lead
            </Link>
          </HStack>
        )}

        <Spacer />

        {user ? (
          <Button onClick={handleLogout} colorScheme="blue" variant="outline">
            Logout
          </Button>
        ) : (
          <Button as={RouterLink} to="/login" colorScheme="blue">
            Login
          </Button>
        )}
      </Flex>

      <Container maxW="container.xl" pt="80px" pb={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
