import React, { useState } from 'react';
import Header from './Header';

const DonationManager = () => {
  const [formData, setFormData] = useState({
    foodItem: '',
    quantity: '',
    location: '',
    expiryTime: '',
    contactPhone: '',
    servingSize: '',
    dietaryInfo: '',
    storageInstructions: '',
    area: ''
  });
  const [notification, setNotification] = useState(null);
  const userType = localStorage.getItem('userType');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          type: 'error',
          message: 'Please login first'
        });
        return;
      }

      const response = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foodItem: formData.foodItem,
          quantity: formData.quantity,
          location: formData.location,
          expiryTime: formData.expiryTime,
          donorPhone: formData.contactPhone,
          servingSize: formData.servingSize,
          dietaryInfo: formData.dietaryInfo,
          storageInstructions: formData.storageInstructions,
          area: formData.area
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: userType === 'ngo' 
            ? 'Donation posted successfully! Other NGOs will be able to claim this donation.'
            : 'Donation posted successfully! NGOs in the area will be notified.'
        });

        setFormData({
          foodItem: '',
          quantity: '',
          location: '',
          expiryTime: '',
          contactPhone: '',
          servingSize: '',
          dietaryInfo: '',
          storageInstructions: '',
          area: ''
        });
      } else {
        throw new Error(result.message || 'Failed to post donation');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to post donation. Please try again.'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-16 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {userType === 'ngo' ? 'Share Available Food' : 'Donate Food'}
          </h1>
          <p className="text-gray-600">
            {userType === 'ngo' 
              ? 'Share excess food with other NGOs to maximize impact'
              : 'Help reduce food waste by donating excess food'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Food Item</label>
              <input
                type="text"
                name="foodItem"
                value={formData.foodItem}
                onChange={handleInputChange}
                placeholder="What food items are you sharing?"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="How many servings/portions?"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Which area? (downtown, uptown, etc.)"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pickup Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Address for pickup"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Best Before Time</label>
              <input
                type="datetime-local"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Your contact number"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Serving Size</label>
            <input
              type="text"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleInputChange}
              placeholder="e.g., Serves 50 people"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Storage Instructions</label>
            <textarea
              name="storageInstructions"
              value={formData.storageInstructions}
              onChange={handleInputChange}
              placeholder="Any special storage or handling instructions?"
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dietary Information</label>
            <textarea
              name="dietaryInfo"
              value={formData.dietaryInfo}
              onChange={handleInputChange}
              placeholder="Any allergens or dietary information? (vegetarian, contains nuts, etc.)"
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {userType === 'ngo' ? 'Share Food' : 'Post Donation'}
          </button>
        </form>

        {notification && (
          <div className={`mt-4 p-4 rounded ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationManager;