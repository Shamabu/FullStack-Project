import logo from './logo.svg';
import React, { useState } from 'react';
import UserForm from './Forms/userForm';
import UserList from './Forms/userList';
import { Container, Row, Col } from 'react-bootstrap';

const App = () => {
    const [users, setUsers] = useState([]);

    const AddUser = (user) => {
        console.log("callback to upper method:", user);
        let usersUpdated = [...users, user];
        setUsers(usersUpdated);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <UserForm onAddUser={AddUser} />
                    <UserList users={users} />
                </Col>
            </Row>
        </Container>
    );
};

export default App;
