import { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  HStack,
  IconButton,
  Badge,
  Select,
  Flex,
  Text,
  useToast,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiEdit, FiTrash2, FiChevronDown, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import type { Lead, LeadStatus } from '../types';

interface LeadListProps {
  leads: Lead[];
  isLoading: boolean;
  onDeleteLead: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
}

const LeadList = ({ leads, isLoading, onDeleteLead, onStatusChange }: LeadListProps) => {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const toast = useToast();

  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await onStatusChange(id, status);
      toast({
        title: 'Status updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await onDeleteLead(id);
        toast({
          title: 'Lead deleted',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: 'Failed to delete lead',
          status: 'error',
          duration: 2000,
        });
      }
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'blue';
      case 'Contacted':
        return 'purple';
      case 'Qualified':
        return 'teal';
      case 'Proposal':
        return 'orange';
      case 'Negotiation':
        return 'yellow';
      case 'Closed Won':
        return 'green';
      case 'Closed Lost':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = [...leads];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (sortDirection === 'asc') {
          return valueA.localeCompare(valueB);
        }
        return valueB.localeCompare(valueA);
      }


      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [leads, statusFilter, sortField, sortDirection, searchQuery]);

  const statuses: LeadStatus[] = [
    'New', 'Contacted', 'Qualified', 'Proposal',
    'Negotiation', 'Closed Won', 'Closed Lost'
  ];

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Leads</Heading>
      </CardHeader>
      <CardBody>
        <Flex mb={4} direction={{ base: 'column', md: 'row' }} gap={3} justify="space-between">
          <InputGroup maxW={{ base: '100%', md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
            maxW={{ base: '100%', md: '200px' }}
          >
            <option value="All">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Flex>

        {isLoading ? (
          <Box>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`skeleton-${i}`} height="50px" my={2} />
            ))}
          </Box>
        ) : filteredAndSortedLeads.length === 0 ? (
          <Text textAlign="center" py={8} color="gray.500">
            No leads found. Try changing your filters or add a new lead.
          </Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th cursor="pointer" onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSort('email')}>
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSort('phone')}>
                    Phone {sortField === 'phone' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleSort('createdAt')}>
                    Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedLeads.map(lead => (
                  <Tr key={lead._id}>
                    <Td>{lead.name}</Td>
                    <Td>{lead.email}</Td>
                    <Td>{lead.phone}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={Button}
                          size="sm"
                          rightIcon={<FiChevronDown />}
                          colorScheme={getStatusColor(lead.status)}
                          variant="outline"
                        >
                          {lead.status}
                        </MenuButton>
                        <MenuList>
                          {statuses.map(status => (
                            <MenuItem
                              key={status}
                              onClick={() => handleStatusChange(lead._id, status)}
                              isDisabled={status === lead.status}
                            >
                              <Badge colorScheme={getStatusColor(status)} mr={2}>
                                {status}
                              </Badge>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          as={RouterLink}
                          to={`/leads/edit/${lead._id}`}
                          aria-label="Edit"
                          icon={<FiEdit />}
                          size="sm"
                          colorScheme="blue"

                          onClick={() => { console.log('Edit lead', lead); }}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(lead._id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default LeadList;
