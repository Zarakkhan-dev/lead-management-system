import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  useToast,
  Spinner,
  Center,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import Layout from '../components/Layout';
import LeadList from '../components/LeadList';
import { fetchLeads, deleteLead, updateLeadStatus } from '../api/leadsApi';
import type { Lead, LeadStatus } from '../types';

const ITEMS_PER_PAGE = 5;

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toast = useToast();

  useEffect(() => {
    const loadLeads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchLeads();
        setLeads(data);
      } catch (err) {
        setError('Failed to load leads. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load leads',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, [toast]);

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads(leads.filter(lead => lead._id !== id));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw err;
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const updatedLead = await updateLeadStatus(id, status);
      setLeads(leads.map(lead => (lead._id === id ? updatedLead : lead)));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw err;
    }
  };

  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Box>
        <Flex justify="space-between" align="center" mb={5}>
          <Heading size="lg">Manage Leads</Heading>
          <Button
            as={RouterLink}
            to="/leads/new"
            leftIcon={<FiPlus />}
            colorScheme="blue"
          >
            Add New Lead
          </Button>
        </Flex>

        {error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <>
            <LeadList
              leads={paginatedLeads}
              isLoading={isLoading}
              onDeleteLead={handleDeleteLead}
              onStatusChange={handleStatusChange}
            />

            {totalPages > 1 && (
              <Flex justify="center" mt={6}>
                <ButtonGroup isAttached variant="outline">
                  <IconButton
                    aria-label="Previous page"
                    icon={<FiChevronLeft />}
                    isDisabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={`page-${index + 1}`}
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <IconButton
                    aria-label="Next page"
                    icon={<FiChevronRight />}
                    isDisabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </ButtonGroup>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default LeadsPage;
