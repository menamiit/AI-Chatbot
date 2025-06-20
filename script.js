document.querySelector('.send-button').addEventListener('click', async () => {
  const inputField = document.querySelector('.input-area input');
  const userMessage = inputField.value.trim();

  if (userMessage) {
    // Display user message in the chat UI
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.textContent = userMessage;
    document.querySelector('.chat-container').appendChild(userMessageDiv);

    // Clear input field
    inputField.value = '';

    try {
      // Send the message to the backend
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.reply) {
        // Display bot reply in the chat UI
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('bot-message');
        botMessageDiv.innerHTML = `<p>${data.reply}</p>`;
        document.querySelector('.chat-container').appendChild(botMessageDiv);
      }
    } catch (error) {
      console.error('Error fetching bot response:', error);
    }
  }
});
