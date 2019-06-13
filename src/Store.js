import React from "react";
import io from "socket.io-client";
import faker from "faker";

export const Context = React.createContext();

/* Object being sent in action payload to reducer function
  chat {
    from: 'user',
    msg: 'text',
    topic: 'general'
  }

  state {
    general: [{chat}, {chat}, {chat}],
    otherTopic: [{chat}, {chat}, {chat}]
  }
*/

const initialState = {
  channels: {
    General: [
      { from: "Todd", msg: "hey" },
      { from: faker.internet.userName(), msg: faker.random.words() },
      { from: faker.internet.userName(), msg: faker.random.words() }
    ],
    Programming: [
      { from: faker.internet.userName(), msg: faker.hacker.phrase() },
      { from: faker.internet.userName(), msg: faker.hacker.phrase() },
      { from: faker.internet.userName(), msg: faker.hacker.phrase() }
    ],
    Sports: [
      { from: faker.internet.userName(), msg: faker.random.words() },
      { from: faker.internet.userName(), msg: faker.random.words() },
      { from: faker.internet.userName(), msg: faker.random.words() }
    ],
    Movies: [
      { from: faker.internet.userName(), msg: faker.random.words() },
      { from: faker.internet.userName(), msg: faker.random.words() },
      { from: faker.internet.userName(), msg: faker.random.words() }
    ]
  },
  users: []
};

function reducer(state, action) {
  const { from, msg, topic } = action.payload;
  let users = state.users;
  let top = state.channels.Sports;
  console.log(state.channels, "activeTopic");
  switch (action.type) {
    case "USER_CONNECTED":
      return {
        ...state,
        users: [...users, action.payload]
      };
    case "RECIEVE_MESSAGE":
      // console.log({ from, msg }, '******')
      console.log(state.channels[topic], '...state.channels[topic]');

      return {
        ...state,
        channels: {
          ...state.channels, 
          [topic]: [...state.channels[topic], { from, msg }]
        }
        // [top]: [...state.channels[topic], { from, msg }]
      };

    default:
      return state;
  }
}

let socket;

function sendChatAction(value) {
  // console.log('socket.emit in store', value);
  socket.emit("chat message", value);
}

function sendUserConnected(user) {
  // console.log(' sendUserConnected socket.emit in store', user);
  socket.emit("connection message", user);
}

const user = faker.internet.userName();

export default function Store(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  if (!socket) {
    // connect when client starts
    socket = io(":3001");
    socket.on("connection message", function(user) {
      dispatch({ type: "USER_CONNECTED", payload: user });
      console.log({ type: "USER_CONNECTED", payload: user });
    });
    socket.on("chat message", function(message) {
      dispatch({ type: "RECIEVE_MESSAGE", payload: message });
      // console.log({type: 'RECIEVE_MESSAGE', payload: message})
      // console.log('socket.on in store');
    });
  }

  return (
    <Context.Provider
      value={{ state, sendChatAction, sendUserConnected, user }}
    >
      {props.children}
    </Context.Provider>
  );
}
