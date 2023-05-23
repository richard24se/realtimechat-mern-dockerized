import { constants } from "buffer";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
const _ = require("lodash");

export default function Contacts({ onlineUsers, contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [onlineList, setOnlineList] = useState(false);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <button
              className={`allList ${!onlineList ? "active" : ""}`}
              onClick={() => setOnlineList(false)}
            >
              Todos
            </button>

            <h3>Contatos</h3>
            <button
              className={`onlineList ${onlineList ? "active" : ""}`}
              onClick={() => setOnlineList(true)}
            >
              Online
            </button>
          </div>
          <div className="contacts">
            {!onlineList &&
              contacts.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className={`avatar`}>
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt=""
                      />
                      <span
                        className={`${
                          onlineUsers.some((obj) => obj === contact._id)
                            ? "online"
                            : "offline"
                        }`}
                      ></span>
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    </div>
                  </div>
                );
              })}
            {onlineList &&
              contacts.map((contact, index) => {
                if (onlineUsers.includes(contact._id)) {
                  return (
                    <div
                      key={contact._id}
                      className={`contact ${
                        index === currentSelected ? "selected" : ""
                      }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className={`avatar`}>
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt=""
                        />
                        <span
                          className={`${
                            onlineUsers.some((obj) => obj === contact._id)
                              ? "online"
                              : "offline"
                          }`}
                        ></span>
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: rgb(16 17 23 / 25%);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      font-size: 1.6em;
    }
    button {
      background-color: transparent;
      color: #585858;
      cursor: pointer;
      border: 1px solid black;
      font-size: 18px;
      border: none;
      border-bottom: 3px solid #4e4e4e;
      border-radius: 3px;
      transition: 0.3s;
    }
    .active {
      color: white;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
      border-radius: 3px;
      border-bottom: 3px solid #488aab6e;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        // background-color: #ffffff39;
        background-color: #0d2336;
        width: 0.1rem;
        // box-shadow: 0 0 16px 1px rgba(0, 149, 185, 0.5);
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: rgb(32 46 66 / 42%);
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        position: relative;
        img {
          height: 3rem;
        }
        .online {
          position: absolute;
          right: 0px;
          bottom: 0px;
          height: 13px;
          width: 13px;
          background-color: #83ff89;
          border-radius: 100%;
          border: 2px solid black;
          transition: 0.8s;
        }
        .offline {
          position: absolute;
          right: 0px;
          bottom: 0px;
          height: 13px;
          width: 13px;
          background-color: #4b4b4b;
          border-radius: 100%;
          border: 2px solid black;
          transition: 0.8s;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: rgb(122 145 238 / 51%);
    }
  }

  .current-user {
    background-color: rgb(29 36 64 / 65%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    box-shadow: 0 0 25px 10px #000;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
