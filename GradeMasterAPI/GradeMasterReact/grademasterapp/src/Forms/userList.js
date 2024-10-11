import React from "react";
import { ListGroup , Container , Row ,Col } from "react-bootstrap";

const UserList = ({ users }) => {

    return(
        <Container>
            <Row className="justify-content-md-center">
                <Col >
                <h2>List :</h2>
                <ListGroup>
                    {users.map((user,index) => (
                        <ListGroup.Item key={index}>
                            <strong>Name :</strong> {user.name} <br />
                            <strong>Email :</strong> {user.email} <br />
                            <strong>Password :</strong> {user.password} <br />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                
                
                </Col>
            </Row>
        </Container>
    );
};

export default UserList;