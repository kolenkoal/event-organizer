import React, { useContext, useEffect, useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';
import {check, PatchUser} from '../http/userApi'

const Profile = () => {
    // const {user} = useContext(Context)
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        check().then((data) => {
            setId(data.userData.id)
            setName(data.userData.first_name)
            setSurname(data.userData.last_name)
            setEmail(data.userData.email)
        })
    }, [])
    

    const handleSubmit = () => {
        // PatchUser(id, email, 'string', name, surname).then((data) => {
        //     console.log(data)
        // })
        
    };

  return (
    <Container
        fluid 
        style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}   
    >
        <Card 
            style={{ width: '100%', maxWidth: '500px', margin: 'auto'}}
        >

            <Card.Body>
                <Card.Title>Профиль пользователя</Card.Title>
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control type="text" name="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>Сохранить</Button>
                </Form>
            </Card.Body>
        </Card>
    </Container>
    
  );
};

export default Profile;
