import React from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ToursList = () => {
  const navigate = useNavigate();

  // Mock data
  const tours = [
    { id: 1, name: 'Sigiriya Adventure', destination: 'Sigiriya', price: 150, status: 'Active' },
    { id: 2, name: 'Beach Paradise', destination: 'Hikkaduwa', price: 200, status: 'Active' },
    { id: 3, name: 'Cultural Heritage', destination: 'Anuradhapura', price: 180, status: 'Inactive' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tours Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/tours/new')}
        >
          Add New Tour
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.id}</TableCell>
                <TableCell>{tour.name}</TableCell>
                <TableCell>{tour.destination}</TableCell>
                <TableCell>{tour.price}</TableCell>
                <TableCell>{tour.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/tours/${tour.id}/edit`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ToursList;