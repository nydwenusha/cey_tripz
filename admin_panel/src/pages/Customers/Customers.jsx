// Customers.jsx
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Person,
  Save,
  Print
} from '@mui/icons-material';
import './Customers.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const Customers = () => {
  // Initial data
  const initialCustomers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+94 123 456 789',
      totalBookings: 5,
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2024-03-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+94 987 654 321',
      totalBookings: 3,
      status: 'active',
      joinDate: '2024-02-10',
      lastActivity: '2024-03-18'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+94 456 789 123',
      totalBookings: 8,
      status: 'active',
      joinDate: '2024-01-05',
      lastActivity: '2024-03-22'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+94 321 654 987',
      totalBookings: 1,
      status: 'inactive',
      joinDate: '2024-03-01',
      lastActivity: '2024-03-05'
    },
    {
      id: 5,
      name: 'Michael Wilson',
      email: 'michael@example.com',
      phone: '+94 789 123 456',
      totalBookings: 12,
      status: 'active',
      joinDate: '2023-12-20',
      lastActivity: '2024-03-21'
    },
    {
      id: 6,
      name: 'Sarah Brown',
      email: 'sarah@example.com',
      phone: '+94 654 321 987',
      totalBookings: 6,
      status: 'active',
      joinDate: '2024-02-28',
      lastActivity: '2024-03-19'
    }
  ];

  // State
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      if (property === 'totalBookings' || property === 'joinDate') {
        return isAsc ? a[property] - b[property] : b[property] - a[property];
      }
      return isAsc
        ? a[property].localeCompare(b[property])
        : b[property].localeCompare(a[property]);
    });

    setCustomers(sortedCustomers);
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action menu
  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleAction = (action) => {
    console.log(`${action} customer:`, selectedCustomer);
    handleMenuClose();
  };

  // Status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      default: return 'default';
    }
  };

  return (

      <div className="customers-container">
        <PageHeader
          title="Customers Management"
          subtitle="Manage customer details in one place. View contact info, booking history and more."
          primaryAction={{
            label: 'Save',
            onClick: () => navigate('/AddVehicles'),
            icon: <Save />
          }}
          secondaryActions={[
            {
              label: 'Print All',
              onClick: () => handlePrintAll(),
              icon: <Print />
            },
            {
              label: 'Email All',
              onClick: () => handleEmailAll(),
              icon: <Email />
            }
          ]}
          variant="gradient"
        />
        <Paper className="customers-paper">
          {/* Header */}

          <div className="table-header">
           
            <div className="header-actions">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                className="search-field"
              />
              
            </div>
          </div>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'totalBookings'}
                      direction={orderBy === 'totalBookings' ? order : 'asc'}
                      onClick={() => handleSort('totalBookings')}
                    >
                      Total Bookings
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'joinDate'}
                      direction={orderBy === 'joinDate' ? order : 'asc'}
                      onClick={() => handleSort('joinDate')}
                    >
                      Join Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <div className="customer-name-cell">
                          <div className="avatar">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <Typography variant="body1" fontWeight="medium">
                              {customer.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {customer.id}
                            </Typography>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="contact-cell">
                          <div className="contact-item">
                            <Email fontSize="small" />
                            <Typography variant="body2">{customer.email}</Typography>
                          </div>
                          <div className="contact-item">
                            <Phone fontSize="small" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.totalBookings}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status}
                          color={getStatusColor(customer.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(customer.lastActivity).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, customer)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction('View')}>
            <Visibility fontSize="small" className="menu-icon" />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleAction('Edit')}>
            <Edit fontSize="small" className="menu-icon" />
            Edit Customer
          </MenuItem>
          <MenuItem onClick={() => handleAction('Delete')}>
            <Delete fontSize="small" className="menu-icon" />
            Delete Customer
          </MenuItem>
        </Menu>
      </div>
   
  );
};

export default Customers;