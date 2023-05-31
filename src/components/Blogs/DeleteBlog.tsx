import { Button } from "react-bootstrap";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { db, storage } from "../../firebaseConfig";
import { DeleteBlogType } from "../../types/types";

const DeleteBlog = ({ id, imageUrl }: DeleteBlogType) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, "articles", id));
        toast("Deleted", { type: "success" });
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        toast("Error deleting article", { type: "error" });
        console.log(error);
      }
    }
  };

  return (
    <Button variant="secondary" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteBlog;
