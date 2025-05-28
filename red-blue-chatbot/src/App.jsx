import { useState, useEffect, useRef } from 'react';
import { Send, Zap, Bot, User, Sparkles, Flame, Info } from 'lucide-react'; // Import Info icon
import axios from 'axios';

// Simple markdown renderer for bot messages
const renderMarkdown = (text) => {
  // Convert **bold** to <strong>
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert *italic* to <em>
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Convert `code` to <code>
  rendered = rendered.replace(/`(.*?)`/g, '<code class="bg-white/20 px-1 rounded text-sm">$1</code>');
  // Convert line breaks to <br>
  rendered = rendered.replace(/\n/g, '<br>');
  return rendered;
};

export default function App() {
  const [mode, setMode] = useState('blue');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false); // New state for disclaimer
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // Ref for textarea

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Set initial welcome message based on mode and check disclaimer status
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: `Welcome to the nexus. I'm ${mode === 'blue' ? 'Cipher' : 'Phantom'}, your AI companion. What reality shall we explore today?`,
      timestamp: Date.now()
    }]);

    // Check if disclaimer has been seen before
    const disclaimerSeen = localStorage.getItem('gemini_disclaimer_seen');
    if (!disclaimerSeen) {
      setShowDisclaimer(true);
    }
  }, [mode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMode = () => {
    const newMode = mode === 'blue' ? 'red' : 'blue';
    setMode(newMode);
  };

  const simulateTyping = async (response) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    setIsTyping(false);

    setMessages(prev => [...prev, {
      sender: 'bot',
      text: response,
      timestamp: Date.now()
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const chatHistoryForBackend = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await axios.post('https://cipher-and-phantom.onrender.com/api/chat', {
        message: userMessage.text,
        mode: mode,
        history: chatHistoryForBackend
      });

      const aiResponse = response.data.reply;
      await simulateTyping(aiResponse);

    } catch (error) {
      console.error('Error sending message to backend:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Oops! Something went wrong. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem('gemini_disclaimer_seen', 'true');
  };

  const isBlue = mode === 'blue';
  const botName = isBlue ? 'Cipher' : 'Phantom';
  const BotIcon = isBlue ? Zap : Flame;

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      isBlue
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
        : 'bg-gradient-to-br from-gray-900 via-red-900 to-black'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          isBlue ? 'bg-blue-500' : 'bg-red-500'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 animate-pulse delay-1000 ${
          isBlue ? 'bg-cyan-500' : 'bg-orange-500'
        }`}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-2xl backdrop-blur-xl ${
                isBlue ? 'bg-blue-500/20 text-cyan-300' : 'bg-red-500/20 text-red-300'
              }`}>
                <BotIcon size={28} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                  isBlue
                    ? 'from-cyan-300 to-blue-300'
                    : 'from-red-300 to-orange-300'
                } bg-clip-text text-transparent`}>
                  {botName}
                </h1>
                <p className="text-gray-400 text-xs">Advanced AI Neural Interface</p>
              </div>
            </div>

            <button
              onClick={toggleMode}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                isBlue
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
              } hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2`}
            >
              {isBlue ? <Flame size={18} /> : <Zap size={18} />}
              <span>Switch to {isBlue ? 'Phantom' : 'Cipher'}</span>
            </button>
          </div>
        </header>

        {/* Disclaimer Modal/Banner */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className={`bg-white/10 backdrop-blur-xl rounded-lg p-6 max-w-md w-full text-white shadow-2xl border ${
              isBlue ? 'border-blue-400/30' : 'border-red-400/30'
            }`}>
              <div className="flex items-center mb-4">
                <Info className={`mr-3 ${isBlue ? 'text-blue-300' : 'text-red-300'}`} size={24} />
                <h2 className="text-xl font-bold">Important Information</h2>
              </div>
              <p className="text-gray-200 mb-6 leading-relaxed">
                This AI model is trained on a massive dataset of text and code,
                but its knowledge cutoff is **early 2023**. Therefore, it may not have
                information about recent events or developments. For critical or
                time-sensitive tasks, please rely on up-to-date sources like
                Google Search or other verified platforms.
              </p>
              <button
                onClick={handleDismissDisclaimer}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  isBlue
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                } text-white`}
              >
                Got It!
              </button>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <main className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{
                  animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
                }}
              >
                <div className={`max-w-[90%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-center gap-2 mb-1 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`p-1 rounded-full ${
                      msg.sender === 'user'
                        ? 'bg-white/10 text-white'
                        : isBlue
                          ? 'bg-blue-500/20 text-cyan-300'
                          : 'bg-red-500/20 text-red-300'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <BotIcon size={16} />}
                    </div>
                    <span className={`text-xs font-medium ${
                      msg.sender === 'user'
                        ? 'text-white'
                        : isBlue
                          ? 'text-cyan-300'
                          : 'text-red-300'
                    }`}>
                      {msg.sender === 'user' ? 'You' : botName}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl backdrop-blur-xl border ${
                    msg.sender === 'user'
                      ? 'bg-white/10 border-white/20 text-white'
                      : isBlue
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-100'
                        : 'bg-red-500/10 border-red-500/20 text-red-100'
                  }`}>
                    {msg.sender === 'bot' ? (
                      <div
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                      />
                    ) : (
                      <p className="leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[90%]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-full ${
                      isBlue ? 'bg-blue-500/20 text-cyan-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      <BotIcon size={16} />
                    </div>
                    <span className={`text-xs font-medium ${
                      isBlue ? 'text-cyan-300' : 'text-red-300'
                    }`}>
                      {botName}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl backdrop-blur-xl border ${
                    isBlue
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex gap-2 items-center">
                      <div className={`flex gap-1 ${isBlue ? 'text-cyan-300' : 'text-red-300'}`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200"></div>
                      </div>
                      <span className={`text-xs ${isBlue ? 'text-blue-200' : 'text-red-200'}`}>
                        Neural networks processing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <footer className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/5 border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows="1"
                  className={`w-full p-3 pr-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20
                    text-white placeholder-gray-400 outline-none resize-none overflow-hidden max-h-32 ${
                      isBlue ? 'focus:border-blue-500/50' : 'focus:border-red-500/50'
                    }`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTextareaResize(e);
                  }}
                  placeholder="Enter your message to the neural network..."
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                ></textarea>
                <div className="absolute right-3 bottom-3">
                  <Sparkles className={`w-4 h-4 ${
                    isBlue ? 'text-cyan-400' : 'text-red-400'
                  } ${input ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`p-3 rounded-2xl transition-all ${
                  isBlue
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
