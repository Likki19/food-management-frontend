import React, { useState, useEffect } from 'react';
import Header from './Header';

const AvailableFood = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view donations');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }

      const data = await response.json();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/donations/${donationId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Donation claimed successfully!'
        });
        // Refresh the donations list
        fetchDonations();
      } else {
        throw new Error(result.message || 'Failed to claim donation');
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message
      });
    } finally {
      // Clear notification after a delay
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Available Food Donations</h2>

        {notification && (
          <div className={`mb-4 p-4 rounded ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {notification.message}
          </div>
        )}

        {donations.length === 0 ? (
          <div className="text-center text-gray-600">
            No food donations available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div key={donation.id} className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{donation.foodItem}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">Posted by: {donation.donorName}</p>
                  <p><strong>Location:</strong> {donation.location}</p>
                  <p><strong>Area:</strong> {donation.area}</p>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p><strong>Best before:</strong> {new Date(donation.expiryTime).toLocaleString()}</p>
                  <p><strong>Serving size:</strong> {donation.servingSize}</p>
                  
                  {donation.dietaryInfo && (
                    <p><strong>Dietary Info:</strong> {donation.dietaryInfo}</p>
                  )}
                  
                  {donation.storageInstructions && (
                    <p><strong>Storage:</strong> {donation.storageInstructions}</p>
                  )}

                  {userType === 'ngo' && !donation.claimed && (
                    <button
                      onClick={() => handleClaim(donation.id)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                      Claim Donation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableFood;
