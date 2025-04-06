import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, useToast } from '@chakra-ui/react';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';
import { createLead } from '../api/leadsApi';
import type { LeadFormData } from '../types';

const AddLeadPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data: LeadFormData) => {
    setIsLoading(true);

    try {
      await createLead(data);
      toast({
        title: 'Lead created',
        description: 'The lead has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/leads');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create lead. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box maxW="container.md" mx="auto">
        <Heading size="lg" mb={6}>Add New Lead</Heading>
        <LeadForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          formTitle="Lead Information"
          submitLabel="Create Lead"
        />
      </Box>
    </Layout>
  );
};

export default AddLeadPage;
