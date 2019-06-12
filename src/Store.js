import React from 'react';
import io from 'socket.io-client'
import faker from 'faker';

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
  General: [
    {from: 'Todd', msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'}
  ],
  Programming: [
    {from: faker.internet.userName(), msg: faker.hacker.phrase()},
    {from: faker.internet.userName(), msg: faker.hacker.phrase()},
    {from: faker.internet.userName(), msg: faker.hacker.phrase()}
  ],
  Sports: [
    {from: faker.internet.userName(), msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'}
  ],
  Movies: [
    {from: faker.internet.userName(), msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'},
    {from: faker.internet.userName(), msg: 'hey'}
  ],
}

function reducer(state, action) {
  const {from, msg, topic} = action.payload
  switch(action.type) {
    case 'RECIEVE_MESSAGE':
      return {
        ...state,
        [topic]: [
          ...state[topic],
          { from, msg }
        ]
      }
    case 'USER_CONNECTED':
      return {
        ...state,
        
      }
    default: 
      return state
  }
}

let socket;

function sendChatAction(value) {
  console.log('socket.emit in store', value);
  socket.emit('chat message', value);
}

function sendUserConnected(user) {
  console.log(' sendUserConnected socket.emit in store', user);
  socket.emit('connection message', user);
}

const user = faker.internet.userName()

export default function Store(props) {
  // const user = faker.internet.userName()

  const [allChats, dispatch] = React.useReducer(reducer, initialState)

  if(!socket) {
    // connect when client starts
    socket = io(':3001')
    socket.on('connection message', function(user) {
      dispatch({type: 'USER_CONNECTED', payload: user})
      console.log({type: 'USER_CONNECTED', payload: user})
    })
    socket.on('chat message', function(msg){
      dispatch({type: 'RECIEVE_MESSAGE', payload: msg})
      // console.log({type: 'RECIEVE_MESSAGE', payload: msg})
      console.log('socket.on in store');
    });
  }

  

  

  return (
    <Context.Provider value={{allChats, sendChatAction, sendUserConnected, user}}>
      {props.children}
    </Context.Provider>
  )
}