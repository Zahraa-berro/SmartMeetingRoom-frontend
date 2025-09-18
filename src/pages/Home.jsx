import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash, Lock, Envelope, PersonCircle } from 'react-bootstrap-icons';
import '../App.css';
import { useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContexts'; // Import the AuthContext hook
import ForgotPassword from '../components/Auth/ForgotPassword';

// Home Component (Login Page)
const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  
  const { login } = useAuth(); // Get the login function from AuthContext

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email or username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setShowAlert(false);
    setAlertMessage('');
    
    try {
      // Get CSRF token
      await api.get('/sanctum/csrf-cookie');
      
      // Send login request
      const response = await api.post('/api/login', {
        email,
        password
      });
      



    console.log('=== API RESPONSE DEBUG ===');
    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('Response.data.user exists:', !!response.data.user);
    console.log('Response.data.token exists:', !!response.data.token);
    console.log('Response.data.data exists:', !!response.data.data);
    console.log('==========================');
      console.log('Login response:', response.data); // Debug log
      
      // Use AuthContext login function - this stores user data with role
      login(response.data);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] || 
                          error.response?.data?.errors?.password?.[0] || 
                          'Login failed. Please try again.';
      
      setShowAlert(true);
      setAlertMessage(errorMessage);
      setErrors({ message: errorMessage });
      
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <PersonCircle size={50} className="text-primary mb-3" />
                  <h2 className="fw-bold">Smart Meeting Room</h2>
                  <p className="text-muted">Sign in with your email</p>
                </div>
                
                {showAlert && (
                  <Alert 
                    variant="danger" 
                    className="mb-3" 
                    onClose={() => setShowAlert(false)} 
                    dismissible
                  >
                    {alertMessage}
                  </Alert>
                )}
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Envelope className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      className="py-2"
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <Lock className="me-2" />
                      Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                        className="py-2"
                        disabled={isLoading}
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                        disabled={isLoading}
                        type="button"
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3 py-2 fw-semibold login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none text-muted small">
                      Forgot Password?
                    </Link>
                  </div>
                </Form>
                
                <div className="mt-4 pt-3 border-top text-center">
                  <p className="text-muted mb-0 small">
                    Don't have an account? <a href="#signup" className="text-decoration-none">Contact administrator</a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;