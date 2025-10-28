import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ChatPage } from './components/ChatPage';
import { Toaster } from './components/ui/sonner'; // Assuming this provides toast notifications

// --- Type Definitions ---
// Define the structure of user data more precisely if possible
interface User {
  _id: string; // Assuming MongoDB ID
  name: string;
  email: string;
  age: number; // Use number if age is stored as number in DB
  medicalHistory?: string; // Optional field
  // Add other fields returned by your backend if necessary
}

// Define the structure for a chat message
interface Message {
  id?: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Define the structure for a chat session
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function App() {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'chat'>('login');
  const [token, setToken] = useState<string | null>(null); // Store the JWT token
  const [userProfile, setUserProfile] = useState<User | null>(null); // Store logged-in user details
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]); // Store all chat sessions
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // ID of the active chat

  // --- Authentication Handlers ---
  const handleLogin = (receivedToken: string, receivedUser: User) => {
    setToken(receivedToken);
    setUserProfile(receivedUser);
    // TODO: Fetch chat history from backend upon login
    // For now, create a default initial chat
    const initialChat: ChatSession = {
      id: Date.now().toString(), // Use a more robust ID generation later
      title: 'New Chat',
      messages: [{
        id: 'initial-bot-msg',
        content: `Hello ${receivedUser.name}! I'm BAYMAX, your personal mental health companion. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setChatSessions([initialChat]);
    setCurrentChatId(initialChat.id);
    setCurrentPage('chat');
  };

  const handleRegister = (data: { token: string; user: User }) => {
    setToken(data.token);
    setUserProfile(data.user);
     // For now, create a default initial chat
    const initialChat: ChatSession = {
      id: Date.now().toString(), // Use a more robust ID generation later
      title: 'New Chat',
      messages: [{
        id: 'initial-bot-msg',
        content: `Welcome ${data.user.name}! I'm BAYMAX, your personal mental health companion. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setChatSessions([initialChat]);
    setCurrentChatId(initialChat.id);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setToken(null);
    setUserProfile(null);
    setChatSessions([]);
    setCurrentChatId(null);
    setCurrentPage('login');
    // Consider clearing any stored token (e.g., from localStorage) if implemented
  };

  // --- Chat Session Management Handlers ---
  const updateChatSession = (chatId: string, messages: Message[]) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === chatId
          ? {
              ...session,
              messages,
              // Update title based on the first user message if it's a new chat
              title: session.title === 'New Chat' && messages.find(m => m.sender === 'user')
                      ? messages.find(m => m.sender === 'user')!.content.slice(0, 30) + '...'
                      : session.title
            }
          : session
      )
    );
    // TODO: Add backend call here to save the updated messages to the database
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString() + Math.random(), // Slightly better unique ID for now
      title: 'New Chat', // Title will update after first user message
      messages: [{ // Initial bot message for the new chat
        id: 'new-chat-bot-msg',
        content: "How can I help you in this new chat?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    // Add the new chat to the beginning of the list
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id); // Switch to the new chat
     // TODO: Add backend call here to save the new chat session placeholder to the database
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  // Find the currently active chat session based on currentChatId
  const currentChat = chatSessions.find(chat => chat.id === currentChatId);

  // --- Page Rendering Logic ---
  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
    }
    if (currentPage === 'register') {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    // Only render ChatPage if authenticated, user profile exists, and a current chat is selected
    if (currentPage === 'chat' && token && userProfile && currentChat) {
      return (
        <ChatPage
          onLogout={handleLogout}
          userProfile={userProfile} // Pass the correct user profile
          currentChat={currentChat} // Pass the currently active chat
          chatSessions={chatSessions} // Pass the list of all sessions for the sidebar
          onUpdateChat={updateChatSession} // Pass the function to update messages
          onNewChat={createNewChat} // Pass the function to create a new chat
          onSwitchChat={switchChat} // Pass the function to switch chats
          token={token} // Pass the auth token needed for API calls
        />
      );
    }
    // Default to login if state is somehow invalid
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
  };

  return (
    <>
      {/* Container for the current page */}
      <div className="size-full">
        {renderPage()}
      </div>
      {/* Toaster for notifications (part of shadcn/ui setup) */}
      <Toaster />
    </>
  );
}