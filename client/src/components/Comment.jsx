import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  align-items: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
  flex-grow: 1;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: red;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const Comment = ({ comment, onDelete }) => {
  const [channel, setChannel] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/users/find/${comment.userId}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchComment();
  }, [comment.userId]);

  return (
    <Container>
      <Avatar src={channel.img} />
      <Details>
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
      {currentUser?._id === comment.userId && ( // Show delete button only if the user owns the comment
        <DeleteButton onClick={() => onDelete(comment._id)}>
          <AiFillDelete />
        </DeleteButton>
      )}
    </Container>
  );
};

export default Comment;
