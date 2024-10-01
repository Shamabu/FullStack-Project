import React, { useState  } from 'react';
import { Button , Form , Container , Row, Col } from 'react-bootstrap'

const UserForm= () =>
    {
        //Form Data
        const [name,setName] = useState('');
        const [email,setEmail] = useState('');
        const [password,setPassword] = useState('');

        return(
            <Container>
                <Row className="justify-contect-md-center">
                    <Col md={6}>
                      <h2>User :</h2>
                      <Form></Form>
                    </Col>

                </Row>
            </Container>
        );

    };

