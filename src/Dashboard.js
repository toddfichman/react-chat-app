import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import Button from "@material-ui/core/Button";

import Chip from "@material-ui/core/Chip";

import TextField from "@material-ui/core/TextField";

import { Context } from "./Store";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "50px",
    padding: theme.spacing(3, 2)
  },
  flex: {
    display: "flex"
    // alignItems: "center"
  },
  topicTitle: {
    borderBottom: "1px solid black"
  },
  topicsWindow: {
    width: "25%",
    height: "300px",
    borderRight: "1px solid grey"
  },
  chatWindow: {
    width: "50%",
    height: "300px",
    padding: "20px",
    overflow: "auto"
    // transform: 'rotate(180deg)',
    // direction: 'rtl'
  },
  usersList: {
    width: "25%",
    height: "300px",
    borderLeft: "1px solid",
    overflow: "auto"
  },
  chatBox: {
    width: "85%"
  },
  button: {
    width: "15%",
    padding: "1rem"
  },
  chipOther: {
    margin: ".5rem .5rem 0 0 ",
    height: "28px"
  },
  chipUser: {
    margin: ".5rem 0 0 .5rem",
    backgroundColor: "#68C5DB",
    height: "28px",
    textAlign: "right",
    flexDirection: "row-reverse",
    marginLeft: "auto"
  },
  msgOther: {
    margin: ".25rem 0 .5rem .5rem",
    textAlign: "left",
    // transform: 'rotate(180deg)',
    direction: "ltr"
  },
  msgUser: {
    margin: ".25rem 0 .5rem .5rem",
    textAlign: "right",
    // transform: 'rotate(180deg)',
    direction: "ltr"
  },
  listHeader: {
    backgroundColor: "white"
  }
}));

export default function Dashboard() {
  const classes = useStyles();

  //Context store
  const { state, sendChatAction, user, sendUserConnected } = React.useContext(
    Context
  );
  // console.log(user, state.channels[activeTopic], 'state on front end')
  const topics = Object.keys(state.channels);

  // const messagesEndRef = React.useRef(null);
  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  // };
  // React.useEffect(() => sendUserConnected(user));
  // React.useEffect(() => {
  //   scrollToBottom();
  // });

  // const el = React.useRef(null);

  // React.useEffect(() => {
  //   el.current.scrollIntoView({ behavior: "smooth" });
  // });

  React.useEffect(() => sendUserConnected(user), []);

  //Local state
  // initializing state value of textValue = ''
  // to change textValue, we call changeTextValue
  // calling changeTextValue is like calling setState on textValue
  const [textValue, changeTextValue] = React.useState("");
  const [activeTopic, changeActiveTopic] = React.useState(topics[0]);

  console.log(user, state.channels[activeTopic], "state on front end");

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h3" component="h3">
          Chat App
        </Typography>
        <Typography className={classes.topicTitle} variant="h5" component="h5">
          {activeTopic}
        </Typography>
        <div className={classes.flex}>
          <div className={classes.topicsWindow}>
            <List>
              <ListSubheader className={classes.listHeader}>
                Channels
              </ListSubheader>
              {topics.map((topic, index) => (
                <ListItem
                  onClick={event => changeActiveTopic(event.target.innerText)}
                  key={index}
                  button
                >
                  <ListItemText primary={topic} />
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.chatWindow}>
            {state.channels[activeTopic].map((chat, index) => {
              // console.log(state.channels[activeTopic], '&&&&&&')
              return (
                <React.Fragment key={index}>
                  <div className={classes.flex}>
                    <Chip
                      label={chat.from}
                      className={
                        user === chat.from
                          ? classes.chipUser
                          : classes.chipOther
                      }
                    />
                  </div>
                  <div>
                    <Typography
                      variant="body1"
                      className={
                        user === chat.from ? classes.msgUser : classes.msgOther
                      }
                    >
                      {chat.msg}{" "}
                    </Typography>
                  </div>
                </React.Fragment>
              );
            })}
            {/* <div id={"el"} ref={el} /> */}
          </div>
          <div className={classes.usersList}>
            <List>
              <ListSubheader className={classes.listHeader}>
                New Users
              </ListSubheader>
              {state.users.map((user, index) => (
                <ListItem
                  // onClick={event => changeActiveTopic(event.target.innerText)}
                  key={index}
                  // button
                >
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>

        <div className={classes.flex}>
          <TextField
            id="outlined-name"
            label="Send A Message"
            className={classes.chatBox}
            value={textValue}
            onChange={event => changeTextValue(event.target.value)}
            variant="outlined"
            onKeyPress={event => {
              if (event.key === "Enter") {
                sendChatAction({
                  from: user,
                  msg: textValue,
                  topic: activeTopic
                });
                changeTextValue("");
              }
            }}
          />

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              sendChatAction({
                from: user,
                msg: textValue,
                topic: activeTopic
              });
              changeTextValue("");
            }}
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
}
