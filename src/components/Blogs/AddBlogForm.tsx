import React, { useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { Form, Button } from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { AddBlogType } from "../../types/types";

const continents = ["Europe", "Asia", "Africa", "North America", "South America", "Australia"];

const AddBlogForm = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState<AddBlogType>({
    title: "",
    description: "",
    imageUrl: "",
    continent: "",
    createdAt: Timestamp.now(),
  });
  const [selectedContinent, setSelectedContinent] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files && e.target.files[0];
    setFormData({ ...formData, imageUrl: image as File });
  };

  const handleContinentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const continent = e.target.value;
    setSelectedContinent(continent);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.imageUrl) {
      alert("All inputs are required, please fill them!");
      return;
    }

    try {
      // upload image to storage
      const storageData = ref(
        storage,
        `/images/${Date.now()}${
          formData.imageUrl instanceof File
            ? formData.imageUrl.name
            : formData.imageUrl
        }`
      );

      const blob = new Blob([formData.imageUrl], { type: "image/jpeg" });
      const uploadImage = uploadBytesResumable(storageData, blob);

      // wait for upload to complete
      await uploadImage;

      // get download URL of uploaded image
      const imageUrl = await getDownloadURL(uploadImage.snapshot.ref);

      // create new blog post document in firestore
      const blogRef = collection(db, "articles");
      await addDoc(blogRef, {
        title: formData.title,
        description: formData.description,
        imageUrl: imageUrl,
        createdAt: Timestamp.now().toDate(),
        //bonus from auth
        createdBy: user?.displayName,
        userId: user?.uid,
        comments: [],
        continent: selectedContinent,
      });

      // reset form data and show success message
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        continent: "",
      });

      toast("Article added successfully", { type: "success" });
    } catch (error) {
      console.log(error);
      toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-2">
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label className="fw-bold">Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicDescription">
        <Form.Label className="fw-bold">Description</Form.Label>
        <Form.Control
          placeholder="Text here..."
          as={"textarea"}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicImage">
        <Form.Label className="fw-bold">Insert Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          name="imageUrl"
          onChange={handleImageChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicContinent">
        <Form.Label className="fw-bold">Continent</Form.Label>
        <Form.Select
          name="continent"
          value={selectedContinent}
          onChange={handleContinentChange}
          required
        >
          <option value="">Select Continent</option>
          {continents.map((continent) => (
            <option key={continent} value={continent}>
              {continent}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button variant="outline-dark" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default AddBlogForm;
