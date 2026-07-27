document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelectorAll(".toggle-details");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const detailsId = button.getAttribute("aria-controls");
      const detailsElement = document.getElementById(detailsId);

      if (!detailsElement) {
        return;
      }

      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));

      if (isExpanded) {
        detailsElement.hidden = true;
        button.textContent = "See more details";
      } else {
        detailsElement.hidden = false;
        button.textContent = "Hide details";
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const chatClose = document.getElementById("chat-close");
  const chatSend = document.getElementById("chat-send");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  let history = [];

  if (!chatToggle || !chatWindow || !chatClose || !chatSend || !chatInput || !chatMessages) {
    return;
  }

  chatToggle.addEventListener("click", function () {
    chatWindow.style.display = "block";
    chatInput.focus();
  });

  chatClose.addEventListener("click", function () {
    chatWindow.style.display = "none";
  });

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) {
      return;
    }

    addMessage(message, "user-message");
    chatInput.value = "";
    chatSend.disabled = true;

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          history: history
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      addMessage(data.reply, "bot-message");

      history.push({
        role: "user",
        content: message
      });

      history.push({
        role: "assistant",
        content: data.reply
      });

    } catch (error) {
      console.error(error);

      addMessage(
        "Sorry, I couldn't connect to Ask Eric right now.",
        "bot-message"
      );
    } finally {
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.textContent = text;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
