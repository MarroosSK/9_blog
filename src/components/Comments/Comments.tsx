import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../../firebaseConfig";
import { CommentType } from "../../types/types";
import {TiDeleteOutline} from "react-icons/ti";

const Comments = ({ id }: { id: string }) => {
  const [comment, setComment] = useState<string>("");
  const [allComments, setAllComments] = useState<CommentType[]>([]);
  const [currentlyLoggedinUser] = useAuthState(auth);
  const commentRef = doc(db, "articles", id);

  useEffect(() => {
    const commentsData = doc(db, "articles", id);
    onSnapshot(commentsData, (snapshot) => {
      const data = snapshot.data();
      if (data && data.comments) {
        setAllComments(data.comments);
      }
    });
  }, []);

  const handleChangeComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (currentlyLoggedinUser?.uid && currentlyLoggedinUser?.displayName) {
        updateDoc(commentRef, {
          comments: arrayUnion({
            user: currentlyLoggedinUser.uid,
            userName: currentlyLoggedinUser.displayName,
            comment: comment,
            createdAt: new Date(),
            commentId: uuidv4(),
          }),
        }).then(() => {
          setComment("");
        });
      }
    }
  };

  // delete comment function
  const handleDeleteComment = (comment: CommentType) => {
    console.log(comment);
    updateDoc(commentRef, {
      comments: arrayRemove(comment),
    })
      .then((e) => {
        console.log(e);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Container>
      {allComments !== null &&
        allComments.map(({ commentId, user, comment, userName, createdAt }) => (
          <div key={commentId} className="mt-2">
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex gap-2">
                <span
                  className={`badge ${
                    user === currentlyLoggedinUser?.uid
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                >
                  {userName}
                </span>
                {comment}
              </div>
              <div className="col-1">
                {user === currentlyLoggedinUser?.uid && (
                  <TiDeleteOutline
                    style={{ cursor: "pointer", color: "red", width: "2rem" }}
                    onClick={() =>
                      handleDeleteComment({
                        commentId,
                        user,
                        comment,
                        userName,
                        createdAt,
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      {currentlyLoggedinUser && (
        <input
          type="text"
          className="form-control mt-4 mb-5"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          placeholder="Add a comment"
          onKeyUp={(e) => {
            handleChangeComment(e);
          }}
        />
      )}
    </Container>
  );
};

export default Comments;
