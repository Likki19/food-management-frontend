import React, { useState, useEffect } from 'react';
import Header from './Header';

const NGODirectory = () => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view the NGO directory');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/ngos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch NGO directory');
        }

        const data = await response.json();
        setNGOs(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        <h2>NGO Directory</h2>
        <div className="ngo-grid">
          <div className="grid-container">
            {ngos.map((ngo) => (
              <div key={ngo.id} className="ngo-card">
                <h3>{ngo.organization}</h3>
                <p><strong>Area:</strong> {ngo.area}</p>
                <p><strong>Contact:</strong> {ngo.phone}</p>
                <p><strong>Email:</strong> {ngo.email}</p>
                {ngo.description && <p>{ngo.description}</p>}
              </div>
            ))}
          </div>

          {ngos.length === 0 && (
            <div>No NGOs registered at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGODirectory;