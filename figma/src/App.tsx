import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ChatPage } from './components/ChatPage';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'register' | 'chat';

interface UserProfile {
  name: string;
  email: string;
  age: string;
  allergies: string;
  medicalHistory: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleLogin = () => {
    // Mock user data for login
    setUserProfile({
      name: 'John Doe',
      email: 'john@example.com',
      age: '28',
      allergies: 'Peanuts, Penicillin',
      medicalHistory: 'Annual checkups, no major procedures'
    });
    // Create initial chat session
    const initialChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        content: "Hello! I'm BAYMAX, your personal healthcare companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setChatSessions([initialChat]);
    setCurrentChatId(initialChat.id);
    setIsAuthenticated(true);
    setCurrentPage('chat');
  };

  const handleRegister = (userData: UserProfile) => {
    setUserProfile(userData);
    // Create initial chat session
    const initialChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        content: "Hello! I'm BAYMAX, your personal healthcare companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setChatSessions([initialChat]);
    setCurrentChatId(initialChat.id);
    setIsAuthenticated(true);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setChatSessions([]);
    setCurrentChatId(null);
    setCurrentPage('login');
  };

  const updateChatSession = (chatId: string, messages: Message[]) => {
    setChatSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === chatId 
          ? { 
              ...session, 
              messages,
              title: messages.find(m => m.sender === 'user')?.content.slice(0, 30) + '...' || 'New Chat'
            }
          : session
      )
    );
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        content: "Hello! I'm BAYMAX, your personal healthcare companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const currentChat = chatSessions.find(chat => chat.id === currentChatId);

  const switchToRegister = () => {
    setCurrentPage('register');
  };

  const switchToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <>
      <div className="size-full">
        {currentPage === 'login' && (
          <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
        )}
        {currentPage === 'register' && (
          <Register onRegister={handleRegister} onSwitchToLogin={switchToLogin} />
        )}
        {currentPage === 'chat' && isAuthenticated && userProfile && currentChat && (
          <ChatPage 
            onLogout={handleLogout} 
            userProfile={userProfile}
            currentChat={currentChat}
            chatSessions={chatSessions}
            onUpdateChat={updateChatSession}
            onNewChat={createNewChat}
            onSwitchChat={switchChat}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}
