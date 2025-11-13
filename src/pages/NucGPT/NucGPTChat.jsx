// src/pages/NucGPT/NucGPTChat.jsx
import React, { useState, useEffect } from "react";


// Com proxy reverso, API URL relativa ao mesmo host
const API_URL = "/api/nucgpt";

const NucGPTChat = ({ chatStyles }) => {
  // Estado para armazenar o ID de sessão e o histórico da conversa
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  

  // Efeito que roda apenas uma vez para criar uma nova sessão
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch(`${API_URL}/new_session`, {
          method: 'POST',
        });
        const data = await response.json();
        setSessionId(data.session_id);
      } catch (error) {
        console.error('Erro ao criar sessão:', error);
      }
    };
    createSession();
  }, []); // O array vazio garante que o efeito rode apenas na montagem

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    // Adiciona a mensagem do usuário ao histórico local
    const newUserMessage = { sender: 'Usuário', message: input };
    setHistory(prevHistory => [...prevHistory, newUserMessage]);

    // Mostra a indicação de digitação enquanto espera pela resposta
    setIsTyping(true);

    try {
      // Envia a mensagem para a API com o ID da sessão
      const response = await fetch(`${API_URL}/send_message/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: input }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();

      // Adiciona a resposta do bot ao histórico local
      const newBotMessage = { sender: 'NucGPT', message: data.response };
      setHistory(prevHistory => [...prevHistory, newBotMessage]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = { sender: 'NucGPT', message: 'Desculpe, houve um erro ao processar sua solicitação.' };
      setHistory(prevHistory => [...prevHistory, errorMessage]);

    } finally {
      setIsTyping(false);
      setInput('');
    }
  };

  // Botão opcional para limpar a conversa sem recarregar a página
  const handleClearChat = async () => {
    if (!sessionId) return;
    try {
      await fetch(`${API_URL}/conversation_history/${sessionId}`, {
        method: 'DELETE',
      });
      // Limpa o histórico no estado local do React
      setHistory([]);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  return (
    <div className={chatStyles['chat-container']}>
      <h2>Converse com NucGPT</h2>

      <div className={chatStyles['chat-actions']}>
        {sessionId ? (
          <p className={chatStyles['session-info']}>Sessão: {sessionId.substring(0, 8)}...</p>
        ) : (
          <p className={chatStyles['session-info']}>Iniciando nova conversa...</p>
        )}
        <button onClick={handleClearChat} className={chatStyles['clear-button']}>
          Limpar Conversa
        </button>
      </div>

      <div className={chatStyles['chat-history']}>
        {history.length === 0 ? (
          <p className={chatStyles['empty-message']}>Olá! Sou o NucGPT. Diga algo para começar!</p>
        ) : (
          history.map((msg, index) => (
            <p key={index} className={msg.sender === 'Usuário' ? 'user-message' : 'bot-message'} style={{ whiteSpace: 'pre-line' }}>
              <span className={chatStyles.sender}>{msg.sender}:</span> {msg.message}
            </p>
          ))
        )}
        {isTyping && <p className={chatStyles['typing-indicator']}>NucGPT está digitando...</p>}
      </div>

      <form onSubmit={handleSubmit} className={chatStyles['chat-form']}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={sessionId ? 'Digite sua mensagem...' : 'Iniciando conversa...'}
          disabled={!sessionId || isTyping}
        />
        <button type="submit" disabled={!sessionId || isTyping}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default NucGPTChat;
