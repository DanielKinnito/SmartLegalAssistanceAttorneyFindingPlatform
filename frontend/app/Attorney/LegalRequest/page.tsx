"use client";

import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography, Collapse, IconButton, Chip } from '@mui/material';
import { AccessTime, ExpandMore, ExpandLess } from '@mui/icons-material';
import { fetchLegalRequests, acceptLegalRequest, declineLegalRequest, LegalRequest } from '@/app/services/LegalRequests_api';

interface RequestCardProps {
  request: LegalRequest;
  onAccept: (id: string) => Promise<void>;
  onDecline: (id: string) => Promise<void>;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onDecline }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = async (action: (id: string) => Promise<void>) => {
    try {
      setIsLoading(true);
      await action(request.id);
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-4 rounded-lg mb-4 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Case #{request.case.slice(0, 8)}</span>
              <Chip 
                label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
                size="small"
                color={getStatusColor(request.status)}
                sx={{ height: '20px', fontSize: '0.75rem' }}
              />
            </div>
            <div className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <AccessTime fontSize="small" />
              <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          size="small"
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      <Collapse in={isExpanded}>
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <Typography variant="subtitle2" className="text-gray-500">Requested At</Typography>
                <Typography variant="body2" className="text-gray-700">
                  {new Date(request.requested_at).toLocaleString()}
                </Typography>
              </div>
              {request.responded_at && (
                <div>
                  <Typography variant="subtitle2" className="text-gray-500">Responded At</Typography>
                  <Typography variant="body2" className="text-gray-700">
                    {new Date(request.responded_at).toLocaleString()}
                  </Typography>
                </div>
              )}
              {request.response_message && (
                <div>
                  <Typography variant="subtitle2" className="text-gray-500">Response Message</Typography>
                  <Typography variant="body2" className="text-gray-700">{request.response_message}</Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </Collapse>

      {request.status === 'pending' && (
        <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="contained"
            onClick={() => handleAction(onAccept)}
            disabled={isLoading}
            sx={{
              backgroundColor: '#1E2E45',
              '&:hover': { backgroundColor: '#16233B' },
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.5,
              minHeight: 'auto',
              lineHeight: 1.2
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Accept'}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAction(onDecline)}
            disabled={isLoading}
            sx={{
              backgroundColor: 'red',
              '&:hover': { backgroundColor: 'darkred' },
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.5,
              minHeight: 'auto',
              lineHeight: 1.2
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Decline'}
          </Button>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [requests, setRequests] = useState<LegalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchLegalRequests();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch requests');
      }
      setRequests(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const response = await acceptLegalRequest(id);
      if (response.success) {
        // Refresh the requests list
        await loadRequests();
      } else {
        throw new Error(response.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await declineLegalRequest(id);
      if (response.success) {
        // Refresh the requests list
        await loadRequests();
      } else {
        throw new Error(response.message || 'Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#1E2E45" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="px-20 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Legal Requests</h1>

      {requests.length === 0 ? (
        <Typography>No requests available.</Typography>
      ) : (
        requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      )}
    </div>
  );
};

export default Home;