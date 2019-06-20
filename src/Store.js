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

function remove(array, key, value) {
  const index = array.findIndex(obj => obj[key] === value);
  console.log(index, 'index')
  return index >= 0 ? [
      ...array.slice(0, index),
      ...array.slice(index + 1)
  ] : array;
}

function removeByKey(array, params){
  console.log(array, 'before')
  array.some(function(item, index) {
    return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
  });
  console.log(array, 'after')
  return array;
}


// users = [{name: 'c', id: 'dsevcesve'}, {name: 'c', id: 'dsevcesve'}, {name: 'c', id: 'dsevcesve'}]

function reducer(state, action) {
  const { from, msg, topic, user, id } = action.payload;
  console.log(user, state, '999999')
  let users = state.users;
  // console.log(id, 'USER_DISCONNECTED')
  // let fromUser = from.name
  // console.log(state.channels, "activeTopic");
  switch (action.type) {
    
    case "USER_CONNECTED":
      // console.log(state, user, 'USER_CONNECTED')
      return {
        ...state,
        users: [...users, user],
        // clientIds: [...clientIds, action.payload.id]
      };
      case "USER_DISCONNECTED":
        console.log(users, 'USER_DISCONNECTED')
        // users = users.filter(user => user.id !== id);
        const newArray = users.filter(name => name !== user)
        console.log(newArray, 'USER_DISCONNECTED')
        return {
          ...state,
          users: newArray
        }
      
    case "RECIEVE_MESSAGE":
      // console.log({ from, msg }, '******')
      // console.log(state.channels[topic], '...state.channels[topic]');
      // console.log(from)
      return {
        ...state,
        channels: {
          ...state.channels, 
          [topic]: [...state.channels[topic], { from, msg }]
        }
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
  // console.log(' sendUserConnected socket.emit in store', user, users);
  socket.emit("connection message", {user, users});
}

const user = {name: faker.internet.userName(), id: undefined};

export default function Store(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  if (!socket) {
    // connect when client starts
    socket = io(":3001");
    socket.on("connect", function() {
      user.id = socket.id
      // console.log( user, '**********')
      dispatch({ type: "CONNECTION", payload: {id: socket.id} });
      // console.log({ type: "CONNECTION", payload: {id: socket.id} });
    });
    socket.on("connection message", function({user, users}) {
      // user.id = socket.id
      console.log({ type: "USER_CONNECTED", payload: {user, users} });
      dispatch({ type: "USER_CONNECTED", payload: {user, users} });
    });
    socket.on("chat message", function(message) {
      console.log({type: 'RECIEVE_MESSAGE', payload: message})
      dispatch({ type: "RECIEVE_MESSAGE", payload: message });
      // console.log('socket.on in store');
    });
    socket.on("disconnection", function(socketId) {
      
      console.log( socketId, '**********')
      // console.log({ type: "CONNECTION", payload: {id: socket.id} });
      dispatch({ type: "USER_DISCONNECTED", payload: {id: socketId} });
      // console.log({ type: "CONNECTION", payload: {id: socket.id} });
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
