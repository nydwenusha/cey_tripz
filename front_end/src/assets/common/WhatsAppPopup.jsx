import { useState } from "react";
import "../css/WhatsAppPopup.scss";

const WHATSAPP_NUMBER = "94753228869"; // include country code without +

function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    const url = message.trim()
      ? `${baseUrl}?text=${encodeURIComponent(message.trim())}`
      : baseUrl;
    window.open(url, "_blank");
  };

  return (
    <div className="whatsapp-widget">
      {isOpen && (
        <div className="whatsapp-card">
          <div className="whatsapp-header">
            <div>
              <p className="whatsapp-subtitle">Have a question?</p>
              <h6 className="whatsapp-title">Chat with us on WhatsApp</h6>
            </div>
            <button
              type="button"
              className="whatsapp-close"
              aria-label="Close WhatsApp chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <textarea
            className="whatsapp-input"
            rows={3}
            placeholder="Type your message and we'll reply on WhatsApp"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            className="whatsapp-send"
            onClick={handleSend}
          >
            <i className="fa-brands fa-whatsapp"></i>
            Send via WhatsApp
          </button>
        </div>
      )}

      <button
        type="button"
        className="whatsapp-toggle"
        aria-label="Open WhatsApp chat"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span>Chat</span>
      </button>
    </div>
  );
}

export default WhatsAppPopup;
