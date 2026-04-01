const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");



let userMessage;
const GROQ_API_KEY = "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"; // Replace with your actual API key
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with the message and class name
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;  
}
const generateResponse = (incomingChartLi) => {
      const API_URL = "https://api.groq.com/openai/v1/chat/completions";
      const messageElement = incomingChartLi.querySelector("p");

     // Set up the request options with method, headers, and body
      const requestOptions = {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}` 
        },
        body: JSON.stringify({
             model: "llama-3.3-70b-versatile",
             messages: [{role: "user", content: userMessage}]
        })
    }
    fetch(API_URL, requestOptions).then(response => response.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content;
    }).catch(error => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again."; 
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));  
}

const handlechat = () => {
    // Get the user message and create an outgoing chat li element
    userMessage = chatInput.value.trim();
    if (!userMessage) return; 
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the outgoing message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        // Append a placeholder for the incoming message
        const incomingChartLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChartLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChartLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the chat input based on content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // Send the chat message on Enter key press (without Shift) for wider screens
   if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handlechat();
   }
});


sendChatBtn.addEventListener("click", handlechat);  
chatbotToggler.addEventListener("click", () => {document.body.classList.toggle("show-chatbot");});
chatbotCloseBtn.addEventListener("click", () => {document.body.classList.remove("show-chatbot");}); 