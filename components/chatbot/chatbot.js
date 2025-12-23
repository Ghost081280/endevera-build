/* ============================================
   ENDEVERA CHATBOT COMPONENT
   Claude API-powered chatbot with conversation history
   ============================================ */

document.addEventListener('endevera:components-loaded', function() {
    initChatbot();
});

function initChatbot() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotTyping = document.getElementById('chatbotTyping');

    if (!chatbotButton || !chatbotWindow) return;

    // Load conversation history
    let conversationHistory = loadConversationHistory();

    // Open chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        chatbotInput.focus();
        
        // Disable body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    });

    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }

    // Send message on button click
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    function closeChatbot() {
        chatbotWindow.classList.remove('active');
        document.body.style.overflow = '';
    }

    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Clear input and disable send button
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        // Add user message to UI
        addMessageToUI(message, 'user');

        // Add to conversation history
        conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        chatbotTyping.classList.add('active');

        try {
            // Get page context
            const pageContext = getPageContext();

            // Call Claude API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory.slice(-10), // Last 10 messages
                    context: pageContext
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const botMessage = data.response;

            // Add assistant message to history
            conversationHistory.push({
                role: 'assistant',
                content: botMessage
            });

            // Save conversation history
            saveConversationHistory(conversationHistory);

            // Add bot message to UI
            addMessageToUI(botMessage, 'bot');

        } catch (error) {
            console.error('Chatbot error:', error);
            addMessageToUI('I apologize, but I encountered an error. Please try again.', 'bot');
        } finally {
            // Hide typing indicator and re-enable send button
            chatbotTyping.classList.remove('active');
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
    }

    function addMessageToUI(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${type}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chatbot-message-avatar';
        avatarDiv.innerHTML = type === 'user' 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = message;
        contentDiv.appendChild(messagePara);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Limit messages in DOM to 50
        const messages = chatbotMessages.querySelectorAll('.chatbot-message');
        if (messages.length > 50) {
            messages[0].remove();
        }
    }

    function getPageContext() {
        const pageType = document.body.getAttribute('data-page-type') || 'public';
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentSection = window.location.hash || '';
        
        // Check if user is authenticated
        const isAuthenticated = !!localStorage.getItem('authToken');
        
        return {
            pageType,
            currentPage,
            currentSection,
            isAuthenticated
        };
    }

    function saveConversationHistory(history) {
        try {
            // Keep only last 20 messages
            const trimmedHistory = history.slice(-20);
            localStorage.setItem('endevera_chat_history', JSON.stringify(trimmedHistory));
        } catch (e) {
            console.error('Error saving conversation history:', e);
        }
    }

    function loadConversationHistory() {
        try {
            const saved = localStorage.getItem('endevera_chat_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading conversation history:', e);
            return [];
        }
    }
}

// Utility function to clear chat history
window.clearChatHistory = function() {
    localStorage.removeItem('endevera_chat_history');
    console.log('Chat history cleared');
};
