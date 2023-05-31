import { useState } from 'react';
import { Form, Button  } from 'react-bootstrap';
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { auth } from '../../firebaseConfig';
import {useNavigate} from "react-router-dom";
import {User} from "firebase/auth"
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("")
    const [userEmail, setUserEmail] = useState<string>("")
    const [userPassword, setUserPassword] = useState<string>("")

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, userEmail, userPassword);
            updateProfile(auth.currentUser as User, {displayName: userName});
            navigate("/")
        }catch(error: unknown){
            toast(error instanceof Error ? error.message : "Unknown error", {type: "error"})
        }
    }
  return (
    <Form onSubmit={handleRegister} className="mt-5">
    <Form.Group className="mb-3" controlId="formBasicName">
      <Form.Label className='fw-bold'>Name</Form.Label>
      <Form.Control type="text" name="name" placeholder="Enter name" value={userName} onChange={(e)=> setUserName(e.target.value)} required/>
    </Form.Group>
    <Form.Group className="mb-3 fw-bold" controlId="formBasicEmail">
      <Form.Label>E-mail</Form.Label>
      <Form.Control type="email" name="email" placeholder="Enter email" value={userEmail} onChange={(e)=> setUserEmail(e.target.value)} required/>
    </Form.Group>
    <Form.Group className="mb-3 fw-bold" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" name="password" placeholder="Enter password" value={userPassword} onChange={(e)=> setUserPassword(e.target.value)} required/>
    </Form.Group>
    <Button variant="outline-dark" type="submit">
      Register
    </Button>
  </Form>
  )
}

export default Register