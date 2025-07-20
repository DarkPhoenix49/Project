
const socket = io();
const form = document.getElementById('uploadForm');
const videoInput = document.getElementById('videoInput');
const videoPlayer = document.getElementById('videoPlayer');
const chatInput = document.getElementById('chatInput');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const enterChatBtn = document.getElementById('enterChat');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');

let username = '';

enterChatBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name) {
    username = name;
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
  }
});

chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    socket.emit('chat-message', { user: username, message: chatInput.value });
    chatInput.value = '';
  }
});

socket.on('chat-message', msg => {
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const file = videoInput.files[0];
  if (!file) return;

  const data = new FormData();
  data.append('video', file);

  fetch('/upload', {
    method: 'POST',
    body: data
  })
  .then(res => res.json())
  .then(data => {
    videoPlayer.src = data.videoPath;
    videoPlayer.play();
  });
});

socket.on('new-video', path => {
  videoPlayer.src = path;
  videoPlayer.play();
});
