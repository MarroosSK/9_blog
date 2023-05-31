import {Container, Nav, Navbar} from 'react-bootstrap';
import {Link} from "react-router-dom"
import {useAuthState} from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {LuLogOut} from "react-icons/lu";
import "./Navigation.css";

const Navigation = () => {

  const [user] = useAuthState(auth)
  
  return (
    <Navbar bg="light" expand="md" style={{height: "5rem"}}>
    <Container>
      <Navbar.Brand href="/">ebol<span className='fs-2 h1 text-danger'>G</span></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* ms-auto: urobi medzeru medzi logo a links*/}
          {
            !user ? (
              <div className='d-flex flex-column flex-md-row gap-4'>
              <Link to="/login" className='custom_link text-dark text-decoration-none border-bottom border-3 border-dark'>Login</Link>
              <Link to="/register" className='custom_link text-dark text-decoration-none border-bottom border-3  border-dark'>Register</Link>
              </div>
            ) : (
              <div className='d-flex flex-column flex-md-row  gap-4'>
              <Link to="/add" className='custom_link text-dark text-decoration-none border-bottom border-3 border-dark'>Add Blog</Link>
              <div className='d-flex flex-row justify-content-center align-items-center gap-2'>
                <p className='p-0 m-0'>signed in as <span className='text-success'>{user.displayName || user.email}</span></p>
                <LuLogOut onClick={() =>{signOut(auth)}} style={{cursor: "pointer"}}/>
              </div>
              </div>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default Navigation