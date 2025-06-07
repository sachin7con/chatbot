
  const userInput = document.getElementById('user-input');
  const chatLog = document.getElementById('chat-log');
  const sendButton = document.querySelector('button');

  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return; // do nothing if input is empty

    // Create a new div for user's message
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.padding = '8px';
    msgDiv.style.margin = '6px 0';
    msgDiv.style.background = '#d1e7dd'; // light green bubble for user
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.alignSelf = 'flex-end'; // right side

    chatLog.appendChild(msgDiv);

    // Scroll to bottom
    chatLog.scrollTop = chatLog.scrollHeight;

    // Clear input
    userInput.value = '';

    // Send message to backend API
    fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    .then(res => res.json())
    .then(data => {
      // Show bot reply
      const botDiv = document.createElement('div');
      botDiv.textContent = data.reply;
      botDiv.style.padding = '8px';
      botDiv.style.margin = '6px 0';
      botDiv.style.background = '#e2e3e5'; // gray bubble for bot
      botDiv.style.borderRadius = '6px';
      botDiv.style.alignSelf = 'flex-start'; // left side

      chatLog.appendChild(botDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    })
    .catch(() => {
      // fallback message on error
      const botDiv = document.createElement('div');
      botDiv.textContent = "Oops! Something went wrong.";
      botDiv.style.padding = '8px';
      botDiv.style.margin = '6px 0';
      botDiv.style.background = '#f8d7da'; // red bubble for error
      botDiv.style.borderRadius = '6px';
      botDiv.style.alignSelf = 'flex-start';

      chatLog.appendChild(botDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    });
  }

  sendButton.addEventListener('click', sendMessage);

  userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
