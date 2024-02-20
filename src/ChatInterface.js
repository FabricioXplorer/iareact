import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Importa Axios para realizar solicitudes HTTP

const ChatInterface = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const enviarMensaje = () => {
    if (inputText.trim() === '') return;

    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');
    generarRespuestaIA();
  };

  const generarRespuestaIA = async () => {
    try {
      const apiKey = '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'; // Reemplaza con tu clave de API de OpenAI
      const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Verifica la URL de la API

      const requestBody = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: inputText },
        ],
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      const respuestaIA = await axios.post(apiUrl, requestBody, { headers });
      const respuestaJSON = respuestaIA.data;

      setMessages([...messages, { text: respuestaJSON.choices[0].message.content, sender: 'ia' }]);
    } catch (error) {
      console.error('Error al obtener respuesta de la IA:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensaje();
    }
  };

  useEffect(() => {
    // Desplazamiento hacia abajo al agregar un nuevo mensaje
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <Navbar />
      <div className="chat-container">
        <div className="message-container" ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'ia-message'}`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            className="input-text"
          />
          <button onClick={enviarMensaje} className="send-button">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
