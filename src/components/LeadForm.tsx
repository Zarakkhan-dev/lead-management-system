import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  FormErrorMessage,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import type { Lead, LeadFormData, LeadStatus } from '../types';

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading: boolean;
  formTitle: string;
  submitLabel: string;
}

const LeadForm = ({ lead, onSubmit, isLoading, formTitle, submitLabel }: LeadFormProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'New',
  });

  const [errors, setErrors] = useState<Record<keyof LeadFormData, string>>({
    name: '',
    email: '',
    phone: '',
    status: '',
  });

  const toast = useToast();

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
      });
    }
  }, [lead]);

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      status: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onSubmit(formData);
        toast({
          title: lead ? 'Lead updated' : 'Lead created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to save lead. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const statuses: LeadStatus[] = [
    'New', 'Contacted', 'Qualified', 'Proposal',
    'Negotiation', 'Closed Won', 'Closed Lost'
  ];

  return (
    <Card>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Heading size="md" mb={4}>{formTitle}</Heading>

          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter lead name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter lead email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phone}>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter lead phone"
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.status}>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isLoading}
              type="submit"
            >
              {submitLabel}
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default LeadForm;
