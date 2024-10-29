import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../designs/register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        userType: 'donor', // Default to donor
        organization: '', // Only for NGO
        area: '' // Only for NGO
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.success) {
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        } catch (error) {
            setMessage('Server error. Please try again.');
        }
    };

    return (
        <div className="container1">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                />
                <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                >
                    <option value="donor">Donor</option>
                    <option value="ngo">NGO</option>
                </select>

                {formData.userType === 'ngo' && (
                    <>
                        <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Organization Name"
                            required
                        />
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Service Area"
                            required
                        />
                    </>
                )}

                <button type="submit">Register</button>
            </form>
            <p className="switch-form">
                Already have an account? <a href="/login">Login</a>
            </p>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Register;
