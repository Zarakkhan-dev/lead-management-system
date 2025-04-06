import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';
import { fetchLead, updateLead } from '../api/leadsApi';
import type { Lead, LeadFormData } from '../types';

const EditLeadPage = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadLead = async () => {
      if (!id) {
        setError('Lead ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchLead(id);
        setLead(data);
      } catch (err) {
        setError('Failed to load lead details. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load lead',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [id, toast]);

  const handleSubmit = async (data: LeadFormData) => {
    if (!id) return;

    setIsSubmitting(true);

    try {
      await updateLead(id, data);
      toast({
        title: 'Lead updated',
        description: 'The lead has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/leads');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box maxW="container.md" mx="auto">
        <Box mb={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/leads')}
          >
            Back to Leads
          </Button>
          <Heading size="lg" mt={2}>Edit Lead</Heading>
        </Box>

        {isLoading ? (
          <Center py={10}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : lead ? (
          <LeadForm
            lead={lead}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            formTitle="Edit Lead Information"
            submitLabel="Update Lead"
          />
        ) : (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Lead Not Found</AlertTitle>
            <AlertDescription>The lead you're looking for doesn't exist.</AlertDescription>
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default EditLeadPage;
