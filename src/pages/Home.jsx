import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash, Lock, Envelope, PersonCircle } from 'react-bootstrap-icons';
import '../App.css';

// Import the external ForgotPassword component
import ForgotPassword from '../components/Auth/ForgotPassword';

// Home Component (Login Page)
const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Authentication logic here
      // For demo purposes, we'll just navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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
                  <p className="text-muted">Sign in to access your meeting dashboard</p>
                </div>
                
                {showAlert && (
                  <Alert variant="danger" className="mb-3">
                    Invalid credentials. Please try again.
                  </Alert>
                )}
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <Envelope className="me-2" />
                      Email/Username
                    </Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter email or username" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      className="py-2"
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
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
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