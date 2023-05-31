import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
      navigate("/");
    } catch (error: unknown) {
      toast(error instanceof Error ? error.message : "Unknown error", {
        type: "error",
      });
    }
  };

  return (
    <Form onSubmit={handleLogin} className="mt-5">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="fw-bold">E-mail</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="fw-bold">Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="outline-dark" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default Login;
