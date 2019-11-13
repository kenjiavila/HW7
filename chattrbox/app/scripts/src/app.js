import socket from "./ws-client";
import {ChatForm, Chatlist, promptForUsername} from './dom';
import {UserStore} from './storage';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  userStore.set(username);
}


class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);
    // console.log("Hello ES6!");
    socket.init("ws://localhost:3001");
    socket.registerOpenHandler(() => {

      this.chatForm.init((data) => {
        let message = new ChatMessage(data);
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });
    socket.registerMessageHandler((data) => {
      // console.log(data);
      let message = new ChatMessage(data);
      this.chatList.drawMessage(message.serialize());
    });
  }
}

class ChatMessage {
  constructor({
    message: m,
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.user = u;
    this.message = m;
    this.timestamp = t;
  }
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}
// new ChatApp(); Old part
export default ChatApp;
