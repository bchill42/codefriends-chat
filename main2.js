console.log("working");

let messages = [];

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
  // const response = await fetch("http://localhost:3000/message", {
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
  const oldDivContainer = document.querySelector(".oldMessageContainer");
  const oldDiv = document.querySelector(".oldMessage").cloneNode(true);
  oldDiv.querySelector(".message").innerHTML = `${message}`;
  oldDiv.querySelector(".userName").innerHTML = `${user}`;
  if (createdAt) {
    oldDiv.querySelector(".createdAt").innerHTML = `${createdAt}`;
  } else {
    oldDiv.querySelector(".createdAt").innerHTML = "";
  }
  console.log(message.createdAt);
  oldDivContainer.append(oldDiv);

  const editButtonEl = oldDiv.querySelector(".edit");
  editButtonEl.addEventListener("click", onEditMessage);
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
  const editedMessage = editedMessageContainer.querySelector("#editedMessage")
    .value;
  console.log("parentNode", this.parentNode);
  console.log("edited Message", editedMessage);
  const saveMessage = (editedMessageContainer.querySelector(
    ".message"
  ).innerHTML = `${editedMessage}`);
  // save edit to server
}

//   label.innerHTML = `<input class="checkbox" type="checkbox" checked /> ${description}`;

//   // update the items array to reflect the new completed status of the todo
const children = [...document.querySelector(".message").children];
// const clickedLabel = this.parentNode;
//   const clickedIndex = children.indexOf(this.parentNode);
//   items[clickedIndex].completed = this.checked;

//   // update the server to reflect the new completed status of the todo
//   const response = await fetch(
//     `http://todo.codefriends.larner.com/item/${items[clickedIndex].id}`,
//     {
//       method: "PUT",
//       body: JSON.stringify({
//         completed: this.checked,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const json = await response.json();

// when the page first loads
async function onPageLoad() {
  console.log("onPageLoad");
  // Get access to all the important elements (text input, add button, items div)
  const addButtonEl = document.querySelector("#add-item-button");

  addButtonEl.addEventListener("click", onAddMessage);

  // fetch all of the todo items from the server
  // const response = await fetch("http://localhost:3000/messages", {
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
