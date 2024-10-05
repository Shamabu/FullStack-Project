import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const UserForm = ({ onAddUser }) => {
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Uncomment or define if you need userType for your form logic
  // const [userType, setUserType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddUser({ name, email, password });
    setName('');
    setEmail('');
    setPassword('');
    // Handle sign-in logic here
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h2>User :</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="FormName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="FormEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="FormPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserForm;
