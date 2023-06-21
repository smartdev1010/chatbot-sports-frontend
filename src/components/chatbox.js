import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

const ChatBox = () => {
  // Hooks
  const [history, setHistory] = useState([
    {
      type: "human",
      text: "Hello!",
    },
    {
      type: "bot",
      text: `Ask me any thing.`,
    },
  ]); // Chat History
  const [prompt, setPrompt] = useState(""); // User Message Input
  const [isAnswered, setIsAnswered] = useState(true); // Answer state
  const chatHistoryRef = useRef(null);
  const params = useParams();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:9000/api/server/chat`
  ); // Websocket Hook

  // Receive Messages
  useEffect(() => {
    if (lastMessage !== null) {
      // Add History
      setHistory((prev) =>
        prev.concat({ type: "bot", text: lastMessage.data })
      );

      setTimeout(() => {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }, 50);
      // Think Stop Flag
      setIsAnswered(true);
    }
  }, [lastMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Before answer, make user not to ask questions
    if (!isAnswered) {
      alert("AI Bot is thinking.");
      return;
    }

    setIsAnswered(false);
    history.push({ type: "human", text: prompt });
    setHistory([...history]);
    setTimeout(() => {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }, 100);
    sendMessage(prompt);
    setPrompt("");
  };

  const ChatItem = (type, message, index) => {
    return (
      <div
        key={index}
        style={
          type === "bot"
            ? { display: "flex", flexDirection: "row" }
            : { display: "flex", flexDirection: "row-reverse" }
        }
      >
        <img
          alt="icon"
          src={type === "bot" ? "/assets/img/bot.png" : "/assets/img/user.png"}
          width={35}
          height={35}
        />
        <div
          style={{ maxWidth: 600 }}
          className={type === "bot" ? "bot_item_content" : "user_item_content"}
        >
          {message}
        </div>
      </div>
    );
  };

  return (
    <div className="chat_container">
      <div className="chat_history" ref={chatHistoryRef}>
        {history.map((item, index) => ChatItem(item.type, item.text, index))}
      </div>
      <form className="message_box" onSubmit={handleSubmit}>
        <input
          className="message-input"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type here..."
          value={prompt}
        />
        <button className="message-btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
