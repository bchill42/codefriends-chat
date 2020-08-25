console.log("working");

let messages = [];
const reactionOb = [
  { id: 1, emoji: "👍", picked: false },
  { id: 2, emoji: "😆", picked: false },
  { id: 3, emoji: "😉", picked: false },
  { id: 4, emoji: "🙌", picked: false },
];
let reactionAddedArray = [];

// when we click the add button
async function onAddMessage(event) {
  console.log("onAddMessage");
  event.preventDefault();
  const inputEl = document.querySelector("#item-text");
  const message = inputEl.value;
  const user = document.querySelector(".userName").innerHTML;

  // add a new item to the page and listen for click events on the new item
  addMessageToPage(message, user);

  // clear the contents of the input box
  inputEl.value = "";

  // add the new item to the server
  //   const response = await fetch("http://localhost:3000/message", {
  const response = await fetch("http://chat.codefriends.larner.com/message", {
    method: "POST",
    body: JSON.stringify({
      message: message,
      user: user,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const oldMessage = await response.json();
  messages.push(oldMessage);
}

// given a todo description and completed status, add that todo to the page
// and listen for click events on the new todo item to update the completed
// status
function addMessageToPage(message, user, createdAt) {
  console.log("adding messages to page");
  const oldDivContainer = document.querySelector(".oldMessageContainer");
  const oldDiv = document.querySelector(".oldMessage").cloneNode(true);
  oldDiv.querySelector(".message").innerHTML = `${message}`;
  oldDiv.querySelector(".userName").innerHTML = `${user}`;
  let date = new Date(createdAt);
  console.log(date);
  let localDate = date.toLocaleDateString();
  let localHour = date.getHours();
  let ampm = "am";
  if (localHour > 12) {
    localHour = localHour - 12;
    ampm = "pm";
  }
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let time = `${localDate} ${localHour}:${minutes}:${seconds}:${ampm}`;
  console.log("local hour", localHour - 5);
  console.log("createdAt", localDate);
  if (createdAt) {
    oldDiv.querySelector(".createdAt").innerHTML = `${time}`;
  } else {
    oldDiv.querySelector(".createdAt").innerHTML = "";
  }
  oldDivContainer.append(oldDiv);

  const editButtonEl = oldDiv.querySelector(".edit");
  editButtonEl.addEventListener("click", onEditMessage);

  const reactionButtonEl1 = oldDiv.querySelector("#reaction1");
  const reactionButtonEl2 = oldDiv.querySelector("#reaction2");
  const reactionButtonEl3 = oldDiv.querySelector("#reaction3");
  const reactionButtonEl4 = oldDiv.querySelector("#reaction4");
  reactionButtonEl1.innerHTML = `${reactionOb[0].emoji}`;
  reactionButtonEl2.innerHTML = `${reactionOb[1].emoji}`;
  reactionButtonEl3.innerHTML = `${reactionOb[2].emoji}`;
  reactionButtonEl4.innerHTML = `${reactionOb[3].emoji}`;
  reactionButtonEl1.num = 0;
  reactionButtonEl2.num = 1;
  reactionButtonEl3.num = 2;
  reactionButtonEl4.num = 3;

  console.log("reaction button elements", reactionButtonEl1);
  reactionButtonEl1.addEventListener("click", onReaction);
  reactionButtonEl2.addEventListener("click", onReaction);
  reactionButtonEl3.addEventListener("click", onReaction);
  reactionButtonEl4.addEventListener("click", onReaction);
}

// edit existing message
function onEditMessage(event) {
  console.log("onClickTodo", event.target);
  this.removeEventListener("click", onEditMessage);

  this.innerHTML = "save";

  const messageEditDiv = this.parentNode.querySelector(".message");
  const messageToEdit = this.parentNode.querySelector(".message").innerHTML;
  console.log(messageToEdit);
  this.parentNode.querySelector(".message").innerHTML = "";
  let messageForm = document.querySelector("#messageForm");
  let cloneMessage = messageForm.cloneNode(true);
  messageEditDiv.append(cloneMessage);
  console.log(this);
  console.log(messageEditDiv);
  messageEditDiv.querySelector(
    "#messageForm"
  ).innerHTML = `<input id="editedMessage" value="${messageToEdit}">`;
  this.addEventListener("click", onSaveMessage);
}

async function onSaveMessage(event) {
  console.log("onSaveMessage", event.target);
  this.removeEventListener("click", onSaveMessage);
  this.addEventListener("click", onEditMessage);
  this.innerHTML = "edit";
  const editedMessageContainer = this.parentNode;
  const editedOldMessage = editedMessageContainer.parentNode;
  console.log("edited Message Container", editedMessageContainer);
  const editedUser = document.querySelector(".userName").innerHTML;
  console.log(editedUser);
  const editedMessage = editedMessageContainer.querySelector("#editedMessage")
    .value;
  console.log("parentNode", this.parentNode);
  console.log("edited Message", editedMessage);
  const saveMessage = (editedMessageContainer.querySelector(
    ".message"
  ).innerHTML = `${editedMessage}`);
  // save edit to server
  const children = [...document.querySelector(".oldMessageContainer").children];
  console.log("children", children);
  const editedIndex = children.indexOf(editedOldMessage.parentNode);

  console.log("editedIndex", editedIndex);
  //   const response = await fetch(`http://localhost:3000/message/${editedIndex}`, {
  const response = await fetch("http://chat.codefriends.larner.com/message", {
    method: "PUT",
    body: JSON.stringify({
      message: editedMessage,
      user: editedUser,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const oldMessage = await response.json();
}

function onReaction(event) {
  console.log("clicked a reaciton", event.target);
  console.log("event parent", event.target.parentNode);
  console.log("event target num", event.target.num, typeof event.target.num);
  console.log("picked?", reactionOb[event.target.num].picked);
  const oldMessageContainer = document.querySelector(".oldMessageContainer");
  console.log("oldMessageContainer", oldMessageContainer);
  const children = [...oldMessageContainer.children];
  console.log("children", children);
  const reactionParentConainter = this.closest(".oldMessage");
  const clickedIndex = children.indexOf(reactionParentConainter);
  console.log("reaction index", clickedIndex);
  const userReactionDiv = reactionParentConainter.querySelector(
    ".userReaction"
  );
  if (reactionOb[event.target.num].picked === false) {
    userReactionDiv.innerHTML =
      userReactionDiv.innerHTML + event.target.innerHTML;
    reactionOb[event.target.num].picked = true;
  } else {
    console.log("reactions", userReactionDiv.innerHTML);
    reactionOb[event.target.num].picked = false;
  }
}

// when the page first loads
async function onPageLoad() {
  console.log("onPageLoad");
  // Get access to all the important elements (text input, add button, items div)
  const addButtonEl = document.querySelector("#add-item-button");
  addButtonEl.addEventListener("click", onAddMessage);
  // fetch all of the todo items from the server
  //   const response = await fetch("http://localhost:3000/messages", {
  const response = await fetch("http://chat.codefriends.larner.com/messages", {
    method: "GET",
  });
  // update items array to include the data we got back from the server
  messages = await response.json();
  console.log(messages);
  // loop over all those items
  for (let i = 0; i < messages.length; i++) {
    const oldMessage = messages[i];
    addMessageToPage(oldMessage.message, oldMessage.user, oldMessage.createdAt);
  }
  let intervalID = window.setInterval(checkNewMessages, 5000);
  //   checkNewMessages();
}

// check for new messages on the server
// if new messages are found then add them to the page
async function checkNewMessages() {
  console.log("check for new messages");
  let afterId = messages.length;
  console.log(`after id: ${afterId}`);
  const response = await fetch(
    // `http://localhost:3000/messages?afterId=${afterId}`,
    `http://chat.codefriends.larner.com/messages?afterId=${afterId}`,
    {
      method: "GET",
    }
  );

  // update items array to include the data we got back from the server
  newMessages = await response.json();

  console.log(newMessages);
  // loop over all those items
  for (let i = 0; i < newMessages.length; i++) {
    const oldMessage = newMessages[i];
    addMessageToPage(oldMessage.message, oldMessage.user, oldMessage.createdAt);
  }
}

onPageLoad();
