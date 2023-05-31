import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Dropdown, DropdownButton } from "react-bootstrap";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import DeleteBlog from "./DeleteBlog";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { BlogType } from "../../types/types";

const AllBlogs = () => {
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [filterByContinent, setFilterByContinent] = useState<string | null>(null);

  useEffect(() => {
    const blogsData = collection(db, "articles");
    const queryData = query(blogsData, orderBy("createdAt", "desc"));
    onSnapshot(queryData, (snapshot) => {
      const currentBlogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as BlogType);
      setBlogs(currentBlogs);
    });
  }, []);


  const handleContinentChange = (continent: string) => {
    setFilterByContinent(continent === "all" ? null : continent);
  };

  const blogsComponent = (
    <Row className="d-flex flex-row flex-wrap">
    {blogs
      .filter((blog) => {
        if (filterByContinent === null) {
          return true;
        }
        if (filterByContinent !== "all") {
          return blog.continent.includes(filterByContinent);
        }
        return true;
      })
      .map((blog) => (
        <Col
          key={blog.id}
          xs={12}
          sm={6}
          md={4}
          lg={4}
          className="d-flex justify-content-center"
        >
          <Card style={{width: "29rem"}} className="mb-2">
            <Link to={`/blog/${blog.id}`}>
              <Card.Img variant="top" src={blog.imageUrl?.toString()} style={{width: "100%", height: "11rem"}} />
            </Link>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Text style={{fontSize: "12px"}}>{blog.continent}</Card.Text>
                <Card.Text style={{fontSize: "12px"}}>{blog.createdBy}</Card.Text>
              </div>
              <Card.Title style={{fontSize: "18px"}}>{blog.title}</Card.Title>
              <Card.Text style={{fontSize: "12px"}}>{blog.description.slice(0, 150)}...</Card.Text>
              {blog && user?.uid === blog.userId && <DeleteBlog id={blog.id} imageUrl={blog.imageUrl} />}
            </Card.Body>
          </Card>
        </Col>
      ))}
  </Row>
  );

  return (
<Container>
  <div className="mb-3 mt-4">
    <DropdownButton id="dropdown-continent-button" title={filterByContinent ? filterByContinent : "All"} variant="dark">
      <Dropdown.Item onClick={() => handleContinentChange("all")}>Show All</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("Africa")}>Africa</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("Asia")}>Asia</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("Europe")}>Europe</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("North America")}>North America</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("South America")}>South America</Dropdown.Item>
      <Dropdown.Item onClick={() => handleContinentChange("Australia")}>Australia</Dropdown.Item>
    </DropdownButton>
  </div>
  <Row className="d-flex flex-row flex-wrap">{blogsComponent}</Row>
</Container>
  );
};

export default AllBlogs;
