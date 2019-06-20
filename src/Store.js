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
  users: [],
  clientIds: []
};

function reducer(state, action) {
  const { from, msg, topic, user } = action.payload;
  
  let users = state.users;
  // let fromUser = from.name
  // console.log(state.channels, "activeTopic");
  switch (action.type) {
    
    case "USER_CONNECTED":
      console.log(state, user, 'USER_CONNECTED')
      return {
        ...state,
        users: [...users, user],
        // clientIds: [...clientIds, action.payload.id]
      };
      case "USER_DISCONNECTED":
      return state.filter(user => user.name !== user.name);
    case "RECIEVE_MESSAGE":
      // console.log({ from, msg }, '******')
      // console.log(state.channels[topic], '...state.channels[topic]');
      console.log(from)
      // let fromName = from.name
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

function sendUserConnected(user, users) {
  console.log(' sendUserConnected socket.emit in store', user, users);
  socket.emit("connection message", {user, users});
}

const user = {name: faker.internet.userName(), id: undefined};

export default function Store(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  if (!socket) {
    // connect when client starts
    socket = io(":3001");
    socket.on("connect", function(allClientIds) {
      user.id = socket.id
      console.log( user, '**********')
      dispatch({ type: "CONNECTION", payload: {id: socket.id} });
      // console.log({ type: "CONNECTION", payload: {id: socket.id} });
    });
    socket.on("connection message", function({user, users}) {
      dispatch({ type: "USER_CONNECTED", payload: {user, users} });
      console.log({ type: "USER_CONNECTED", payload: {user, users} });
    });
    socket.on("chat message", function(message) {
      console.log({type: 'RECIEVE_MESSAGE', payload: message})
      dispatch({ type: "RECIEVE_MESSAGE", payload: message });
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
