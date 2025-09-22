import React, { useState } from "react";
import "../css/ChatAgent.css";

function ChatAgent() {
  // messages for API (must always be string content)
  const [apiMessages, setApiMessages] = useState([
    { role: "assistant", content: "Hi 👋 I'm your Tennis Coach Agent. Ask me anything about playing tennis today." },
  ]);

  // messages for UI (can include structured replies)
  const [uiMessages, setUiMessages] = useState([
    { role: "assistant", content: "Hi 👋 I'm your Tennis Coach Agent. Ask me anything about playing tennis today." },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to both histories
    const userMsg = { role: "user", content: input };
    setApiMessages([...apiMessages, userMsg]);
    setUiMessages([...uiMessages, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...apiMessages, userMsg] }),
      });
      const data = await res.json();

      // Structured reply for UI
      const uiReply = { role: "assistant", content: data.reply };

      // Plain text reply for API context
      const apiReply = {
        role: "assistant",
        content: data.reply.text || JSON.stringify(data.reply),
      };

      setUiMessages([...uiMessages, userMsg, uiReply]);
      setApiMessages([...apiMessages, userMsg, apiReply]);
    } catch (err) {
      console.error(err);
      const errorReply = { role: "assistant", content: "❌ Error contacting agent" };
      setUiMessages([...uiMessages, userMsg, errorReply]);
      setApiMessages([...apiMessages, userMsg, errorReply]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🎾 Tennis Coach Agent</div>

      <div className="chat-messages">
        {uiMessages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="bubble">
              {/* User and plain assistant text */}
              {typeof m.content === "string" ? (
                <p>{m.content}</p>
              ) : (
                <>
                  {/* Thinking steps */}
                  {m.content.reasoning && (
                    <div>
                      <h4>🧠 Thinking steps:</h4>
                      <ul>
                        {m.content.reasoning.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tool results */}
                  {m.content.toolResults &&
                    m.content.toolResults.map((tr, idx) => (
                      <div key={idx} style={{ marginTop: "8px" }}>
                        {tr.tool === "getWeather" && (
                          <p>
                            🌤️ <strong>Weather in {tr.args.location}:</strong>{" "}
                            {tr.result.forecast}, {tr.result.temp}
                          </p>
                        )}
                        {tr.tool === "findTennisCourts" && (
                          <>
                            <p>📍 <strong>Nearby Courts:</strong></p>
                            <ul>
                              {tr.result.map((court, cIdx) => (
                                <li key={cIdx}>
                                  {court.name} {court.available ? "✅ available" : "❌ booked"}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {tr.tool === "checkFriendsAvailability" && (
                          <p>
                            👥 <strong>Friends available:</strong>{" "}
                            {tr.result.length > 0 ? tr.result.join(", ") : "none 😢"}
                          </p>
                        )}
                      </div>
                    ))}

                  {/* Fallback assistant text */}
                  {m.content.text && <p>{m.content.text}</p>}
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="bubble">Thinking...</div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can I play in East London at 11pm with Sarah?"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatAgent;
