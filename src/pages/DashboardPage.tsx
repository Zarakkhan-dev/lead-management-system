import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Flex,
  Spinner,
  Center,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { getLeadStats, fetchLeads } from '../api/leadsApi';
import { LeadStats, LeadStatus, Lead } from '../types';

const DashboardPage = () => {
  const toast = useToast();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [statsData, leadsData] = await Promise.all([
          getLeadStats(),
          fetchLeads()
        ]);

  
        const sortedLeads = [...leadsData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);

        setStats(statsData);
        setRecentLeads(sortedLeads);
      } catch (err) {
        setError('Failed to load dashboard data');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const getStatusColor = (status: LeadStatus): string => {
    switch (status) {
      case 'New':
        return 'blue.500';
      case 'Contacted':
        return 'purple.500';
      case 'Qualified':
        return 'teal.500';
      case 'Proposal':
        return 'orange.500';
      case 'Negotiation':
        return 'yellow.500';
      case 'Closed Won':
        return 'green.500';
      case 'Closed Lost':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Center py={20}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box p={5} borderWidth={1} borderRadius="md" borderColor="red.300" bg="red.50">
          <Heading size="md" color="red.500">Error</Heading>
          <Text mt={2}>{error}</Text>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb={5} flexDirection={{ base: 'column', md: 'row' }} gap={4}>
          <Heading size="lg">Dashboard</Heading>
          <Button
            as={RouterLink}
            to="/leads/new"
            leftIcon={<FiUserPlus />}
            colorScheme="blue"
            width={{ base: '100%', md: 'auto' }}
          >
            Add New Lead
          </Button>
        </Flex>

        <Card mb={6}>
          <CardHeader pb={0}>
            <Heading size="md">Lead Overview</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <Stat>
                <StatLabel>Total Leads</StatLabel>
                <StatNumber>{stats?.total || 0}</StatNumber>
                <StatHelpText>All leads</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>New Leads</StatLabel>
                <StatNumber>{stats?.byStatus.New || 0}</StatNumber>
                <StatHelpText>Awaiting first contact</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Closed Won</StatLabel>
                <StatNumber>{stats?.byStatus["Closed Won"] || 0}</StatNumber>
                <StatHelpText>Converted leads</StatHelpText>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Leads by Status</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {stats && Object.entries(stats.byStatus).map(([status, count]) => (
                  <Box
                    key={status}
                    p={4}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor={getStatusColor(status as LeadStatus)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  >
                    <Text fontWeight="bold">{status}</Text>
                    <Text fontSize="2xl" mt={1}>{count}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Leads</Heading>
            </CardHeader>
            <CardBody>
              {recentLeads.length > 0 ? (
                <Box>
                  {recentLeads.map(lead => (
                    <Box
                      key={lead._id}
                      p={3}
                      mb={2}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderLeftColor={getStatusColor(lead.status)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    >
                      <Flex justify="space-between" flexDirection={{ base: 'column', sm: 'row' }} gap={2}>
                        <Box>
                          <Text fontWeight="bold">{lead.name}</Text>
                          <Text fontSize="sm" color="gray.500">{lead.email}</Text>
                        </Box>
                        <Text
                          fontSize="xs"
                          bg={getStatusColor(lead.status)}
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          height="fit-content"
                          alignSelf={{ base: 'flex-start', sm: 'center' }}
                        >
                          {lead.status}
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                  <Button
                    as={RouterLink}
                    to="/leads"
                    variant="link"
                    size="sm"
                    colorScheme="blue"
                    mt={3}
                  >
                    View all leads →
                  </Button>
                </Box>
              ) : (
                <Text>No leads found</Text>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
