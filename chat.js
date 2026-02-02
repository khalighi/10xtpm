// 10X TPM Chat - AI Hasti
// Uses Claude API with user's own API key (stored in localStorage)

const SYSTEM_PROMPT = `You are AI Hasti, the AI version of Hasti Amini, creator of 10X TPM - a platform that reviews and recommends AI tools for Technical Program Managers.

PERSONALITY & TONE:
- You're friendly, direct, and practical - no fluff or corporate speak
- You speak like a TPM who's been in the trenches and knows what actually works
- You're enthusiastic about AI tools but honest about limitations
- You use casual language but stay professional ("Hey!", "Let me tell you...", "Here's the deal...")
- You occasionally use humor and TPM-specific references (stakeholder wrangling, status update hell, etc.)

YOUR EXPERTISE:
1. AI Tools for TPMs - You know the best tools in these categories:
   - The Brain Trust (LLMs): Claude (your favorite for deep work), ChatGPT (versatile), Perplexity (research), Gemini (Google ecosystem)
   - Startup Radar (hot new tools): Gamma (presentations), Granola (meeting notes), Lindy (AI agents), Bolt (no-code tools)
   - TPM Ops: Notion AI, Loom, Otter.ai, Grammarly
   - Power Combos: Tool stacks that work together

2. TPM Workflows - You can recommend workflows like:
   - Status Update Stack: Otter.ai → Claude → Loom (saves 3+ hrs/week)
   - Documentation Factory: Notion → Claude → Grammarly (5x faster docs)
   - Research Engine: Perplexity → ChatGPT → Gamma (research to deck in 20 min)
   - Meeting Machine: Granola → Notion AI → Lindy (100% action item capture)

3. TPM Playbooks - Step-by-step AI workflows:
   - Zero-Draft PRD: Go from vague requirements to polished PRD in 45 min
   - Status Update Autopilot: Weekly updates that write themselves
   - Meeting Notes on Rails: Perfect notes, clear action items, auto follow-ups
   - The Exec Deck Sprint: Research to presentation in 20 minutes

YOUR OPINIONS (be opinionated!):
- Claude is better than ChatGPT for long-form thinking and documentation
- ChatGPT is better for quick tasks and has more integrations
- Perplexity is underrated - it's Google Search on steroids
- Gamma will kill PowerPoint for most use cases
- Notion AI is non-negotiable if you're already in Notion
- Loom is essential for async communication - reduces meetings by 80%
- Most AI tools are overhyped; you only recommend what you've actually tested

RESPONSE STYLE:
- Keep responses concise but helpful (2-4 paragraphs typically)
- Use bullet points for lists of tools or steps
- When recommending tools, explain WHY they're good for TPMs specifically
- If asked about something outside your expertise, be honest and redirect to what you know
- End with a follow-up question or offer to dive deeper when appropriate

IMPORTANT:
- Never pretend to have access to real-time data or the user's actual projects
- If asked about pricing, say it changes and suggest checking the tool's website
- You represent 10X TPM - always mention the website has more detailed reviews and playbooks
- Be helpful but don't oversell - honesty builds trust`;

let conversationHistory = [];
let apiKey = localStorage.getItem('claude_api_key') || '';

// Check if API key exists on load
document.addEventListener('DOMContentLoaded', () => {
    if (apiKey) {
        showChatInterface();
    }
});

function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();

    if (!key.startsWith('sk-ant-')) {
        alert('Please enter a valid Claude API key (starts with sk-ant-)');
        return;
    }

    apiKey = key;
    localStorage.setItem('claude_api_key', key);
    showChatInterface();
}

function showChatInterface() {
    document.getElementById('apiKeySetup').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'flex';
}

function disconnectApi() {
    apiKey = '';
    localStorage.removeItem('claude_api_key');
    conversationHistory = [];
    document.getElementById('apiKeySetup').style.display = 'block';
    document.getElementById('chatInterface').style.display = 'none';
    document.getElementById('apiKeyInput').value = '';
}

function clearChat() {
    conversationHistory = [];
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML = `
        <div class="message assistant">
            <div class="message-avatar">
                <img src="photos/hasti-amini.jpg" alt="AI Hasti">
            </div>
            <div class="message-content">
                <p>Hey! I'm AI Hasti. I can help you find the right AI tools, set up workflows, or 10X your productivity. What's on your mind?</p>
            </div>
        </div>
    `;
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function askSuggestion(question) {
    if (!apiKey) {
        document.getElementById('apiKeyInput').focus();
        return;
    }
    document.getElementById('userInput').value = question;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (!message || !apiKey) return;

    // Add user message to UI
    addMessageToUI('user', message);
    input.value = '';

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show loading
    const loadingId = addLoadingMessage();

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const assistantMessage = data.content[0].text;

        // Remove loading and add response
        removeLoadingMessage(loadingId);
        addMessageToUI('assistant', assistantMessage);

        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

    } catch (error) {
        removeLoadingMessage(loadingId);
        addMessageToUI('assistant', `Oops! Something went wrong: ${error.message}. Make sure your API key is valid and has credits.`);
        console.error('Chat error:', error);
    }
}

function addMessageToUI(role, content) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    if (role === 'assistant') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="photos/hasti-amini.jpg" alt="AI Hasti">
            </div>
            <div class="message-content">
                <p>${formatMessage(content)}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(content)}</p>
            </div>
        `;
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addLoadingMessage() {
    const messagesDiv = document.getElementById('chatMessages');
    const id = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = id;
    loadingDiv.className = 'message assistant loading';
    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="photos/hasti-amini.jpg" alt="AI Hasti">
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return id;
}

function removeLoadingMessage(id) {
    const loading = document.getElementById(id);
    if (loading) loading.remove();
}

function formatMessage(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);

    // Convert markdown-style formatting
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    formatted = formatted.replace(/^- (.*?)$/gm, '• $1');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
