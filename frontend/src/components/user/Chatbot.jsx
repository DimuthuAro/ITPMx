import React, { useState, useEffect, useRef } from 'react';

const Chatbot = ({ apiKey }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your NoteGenius AI Assistant. How can I help you today?",
      sender: "bot"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user"
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Make a request to the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant for NoteGenius, a comprehensive platform designed to help users organize notes, submit tickets for assistance, and manage user profiles efficiently. 
                  Answer the following question from a user: ${inputValue}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      });
      
      const data = await response.json();
      
      // Extract the response text
      const botResponse = data.candidates[0].content.parts[0].text;
      
      // Add bot message
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot"
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Add error message with exact text as requested
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or submit a support ticket if you need immediate assistance.",
        sender: "bot"
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <button 
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-200"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        )}
      </button>
      
      {/* Chat Window */}
      <div 
        className={`absolute bottom-16 right-0 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">NoteGenius Assistant</h3>
              <p className="text-xs text-gray-400">Powered by Gemini AI</p>
            </div>
          </div>
          
          <button 
            onClick={toggleChat}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto px-4 py-3 bg-gray-900">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="text-left mb-3">
              <div className="inline-block bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              ref={inputRef}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-r-lg px-4 py-2 focus:outline-none transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;