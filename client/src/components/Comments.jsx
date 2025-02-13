import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Fetch comments on load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [videoId]);

  // Function to add a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return; // Prevent empty comments

    try {
      const res = await axios.post("/comments/addComment", {
        videoId,
        desc: commentText,
      });

      if (res.status === 200) {
        setComments((prev) => [res.data, ...prev]); // Add new comment to state
        setCommentText(""); // Clear input
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId)); // Remove from state
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img} alt="User Avatar" />
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button onClick={handleAddComment}>POST</Button>
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onDelete={handleDeleteComment} />
      ))}
    </Container>
  );
};

export default Comments;
