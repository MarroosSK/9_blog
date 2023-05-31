import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  AddBlog,
  AllBlogs,
  Error,
  Login,
  Navigation,
  Register,
  SingleBlog,
} from "./components";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col
            className="d-flex justify-content-center align-items-center mt-5"
          >
            <Routes>
              <Route path="/" element={<AllBlogs />} />
              <Route path="/add" element={<AddBlog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/blog/:id" element={<SingleBlog />} />
              <Route path="/*" element={<Error />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
