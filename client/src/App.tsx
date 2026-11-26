
import { useState } from "react";
import "./App.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
  };

  const handleSend = async () => {
    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to get AI response"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat API Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>AI Assistant</h2>

          <button
            className="new-chat"
            onClick={handleNewChat}
          >
            + New Chat
          </button>
        </div>

        <div className="sidebar-tools">
          <p className="section-label">AVAILABLE TOOLS</p>

          <div className="tool-item">🌤️ Weather</div>
          <div className="tool-item">🧮 Calculator</div>
          <div className="tool-item">🕒 Current Time</div>
          <div className="tool-item">🔎 Web Search</div>
        </div>

        <div className="sidebar-footer">
          Powered by Gemini
        </div>
      </aside>

      {/* Main Chat */}
      <main className="main">
        <header className="topbar">
          <span>AI Chat</span>
          <span className="status">● Backend Ready</span>
        </header>

        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <h1>Hello, how can I help you?</h1>
              <p>
                Ask me anything. I'll find the right tool
                when needed.
              </p>
            </div>
          ) : (
            <div className="messages">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`message ${item.role}`}
                >
                  <div className="message-role">
                    {item.role === "user"
                      ? "You"
                      : "AI Assistant"}
                  </div>

                  <div>{item.content}</div>
                </div>
              ))}

              {loading && (
                <div className="message assistant">
                  <div className="message-role">
                    AI Assistant
                  </div>
                  Thinking...
                </div>
              )}
            </div>
          )}
        </section>

        {/* Message Input */}
        <footer className="input-section">
          <div className="input-box">
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything..."
              rows={1}
            />

            <button
              className="send-button"
              onClick={handleSend}
              disabled={!message.trim() || loading}
            >
              ↑
            </button>
          </div>

          <p className="disclaimer">
            AI can make mistakes. Check important information.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
