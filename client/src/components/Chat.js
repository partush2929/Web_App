import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...messages, 
          { text: message, sender: 'user' },
          { text: data.message, sender: 'bot' }
        ]);
        setMessage('');
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', message || 'No description provided');

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...messages, 
          { 
            text: `Uploaded file: ${file.name}${message ? ` - ${message}` : ''}`, 
            sender: 'user',
            type: 'file',
            fileName: file.name,
            fileUrl: data.file.url
          },
          { text: `File "${file.name}" uploaded successfully!`, sender: 'bot' }
        ]);
        setMessage('');
      } else {
        setError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      setError('An error occurred while uploading the file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === 'file' ? (
              <div className="file-message">
                <span className="file-icon">📎</span>
                <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="file-name">
                  {msg.fileName}
                </a>
                <span className="file-description">{msg.text}</span>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or file description..."
            disabled={isUploading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
          <button
            type="button"
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            📎
          </button>
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chat; 