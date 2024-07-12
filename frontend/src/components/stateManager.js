let chatFrom;
let chatWith;
let groupchat;

// sender
export const getChatFromState = () => chatFrom || "";

// receiver
export const getChatToState = () => chatWith || "";

// group chat
export const getChatGroupState = () => groupchat || "";

// sender
export const setChatFromState = (ChatFromState) => {
  console.log(ChatFromState);
  let chatFrom = ChatFromState; // Update the global variable
  console.log(chatFrom);
};

// receiver
export const setChatToState = (ChatWithState) => {
  console.log(ChatWithState);
  chatWith = ChatWithState; // Update the global variable
  console.log(chatWith);
};

// group chat
export const setChatGroupState = (ChatInGroupState) => {
  console.log(ChatInGroupState);
  groupchat = ChatInGroupState; // Update the global variable
  console.log(groupchat);
};
