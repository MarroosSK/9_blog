import { doc, onSnapshot, } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseConfig";
import { BlogType } from "../../types/types";
import Comments from "../Comments/Comments";
import { Error } from "..";

const SingleBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [oneBlog, setOneBlog] = useState<BlogType>();
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);


  const [_user] = useAuthState(auth);

  

  useEffect(() => {
    const singleDoc = doc(db, "articles", id!);
    onSnapshot(
      singleDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          setOneBlog({ ...(snapshot.data() as BlogType), id: snapshot.id });
          setIsValidUrl(true);
        } else {
          setIsValidUrl(false);
        }
      },
      (error) => {
        setIsValidUrl(false);
        console.log(error);
      }
    );
  }, [id]);

  return (
    <>
      {isValidUrl ? (
        oneBlog ? (
          <Container className="d-flex justify-content-center align-items-center" >
            <Row style={{maxWidth: "50rem"}}>
              <Col>
                <Card>
                  <Card.Img variant="top" src={oneBlog.imageUrl?.toString()} style={{height: "20rem"}} />
                  <Card.Body>
                    <Card.Title>{oneBlog.title}</Card.Title>
                    <div className="d-flex justify-content-between">
                    <Card.Text style={{fontSize: "12px"}}>{oneBlog.continent}</Card.Text>
                    <Card.Text style={{fontSize: "12px"}}>{oneBlog.createdBy}</Card.Text>
                  </div>
                    <Card.Text>{oneBlog.description}</Card.Text>
                  </Card.Body>
                  <h6 className="ms-3">Comments:</h6>
                  <Comments id={oneBlog.id} />
                  <Button onClick={() => navigate("/")} variant="dark">back to list</Button>
                </Card>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Spinner animation="border" variant="primary" />
            <h3>Loading...</h3>
          </Container>
        )
      ) : (
        <Error />
      )}
    </>
  );
};

export default SingleBlog;
