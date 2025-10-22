import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  LogOut,
  Send,
  User,
  Clock,
  Moon,
  Sun,
  X,
  Menu,
  Plus,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface UserProfile {
  name: string;
  email: string;
  age: string;
  allergies: string;
  medicalHistory: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatPageProps {
  onLogout: () => void;
  userProfile: UserProfile;
  currentChat: ChatSession;
  chatSessions: ChatSession[];
  onUpdateChat: (chatId: string, messages: Message[]) => void;
  onNewChat: () => void;
  onSwitchChat: (chatId: string) => void;
}

export function ChatPage({
  onLogout,
  userProfile,
  currentChat,
  chatSessions,
  onUpdateChat,
  onNewChat,
  onSwitchChat,
}: ChatPageProps) {
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight;
    }
  }, [currentChat.messages]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Toggle profile popup
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const newMessages = [...currentChat.messages, userMessage];
    onUpdateChat(currentChat.id, newMessages);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      onUpdateChat(currentChat.id, [...newMessages, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (
      input.includes("anxiety") ||
      input.includes("anxious")
    ) {
      return "I understand you're feeling anxious. Anxiety is a common experience, and there are many effective ways to manage it. Would you like to try some breathing exercises, or would you prefer to talk about what's causing your anxiety?";
    } else if (
      input.includes("stress") ||
      input.includes("stressed")
    ) {
      return "Stress can be overwhelming. Let's work together to identify the sources of your stress and develop coping strategies. Can you tell me more about what's been stressing you lately?";
    } else if (
      input.includes("sleep") ||
      input.includes("insomnia")
    ) {
      return "Sleep issues can significantly impact your mental health. I can help you develop better sleep hygiene practices. How many hours of sleep are you currently getting on average?";
    } else if (
      input.includes("sad") ||
      input.includes("depressed") ||
      input.includes("depression")
    ) {
      return "I'm sorry you're feeling this way. It's important to acknowledge these feelings. While I can provide support and coping strategies, please remember that professional help is available if you need it. Would you like to talk about what's been troubling you?";
    } else if (
      input.includes("help") ||
      input.includes("support")
    ) {
      return "I'm here to support you. I can help with stress management, anxiety relief, mood tracking, breathing exercises, and general mental wellness guidance. What would you like to focus on today?";
    } else {
      return "Thank you for sharing. I'm here to listen and support you. Can you tell me more about how you've been feeling emotionally? Remember, this is a safe space for you to express yourself.";
    }
  };

  // Evaluate mental health status based on user messages
  const evaluateMentalHealth = (): {
    status:
      | "not-evaluated"
      | "normal"
      | "consultation"
      | "urgent";
    label: string;
    color: string;
  } => {
    // Filter only user messages (excluding the initial bot message)
    const userMessages = currentChat.messages.filter(
      (msg) => msg.sender === "user",
    );

    // Not enough data to evaluate
    if (userMessages.length < 3) {
      return {
        status: "not-evaluated",
        label: "Not Evaluated",
        color: "text-muted-foreground",
      };
    }

    // Combine all user messages for analysis
    const allUserText = userMessages
      .map((msg) => msg.content.toLowerCase())
      .join(" ");

    // Urgent keywords (suicidal thoughts, self-harm, severe crisis)
    const urgentKeywords = [
      "suicide",
      "suicidal",
      "kill myself",
      "end my life",
      "want to die",
      "self harm",
      "hurt myself",
      "cutting",
      "overdose",
      "no reason to live",
      "better off dead",
      "can't go on",
    ];

    // Serious concern keywords (depression, severe anxiety, trauma)
    const concernKeywords = [
      "depressed",
      "depression",
      "hopeless",
      "helpless",
      "worthless",
      "panic attack",
      "severe anxiety",
      "can't cope",
      "breakdown",
      "trauma",
      "ptsd",
      "intrusive thoughts",
      "constantly anxious",
      "can't sleep",
      "insomnia",
      "nightmares",
      "overwhelming",
    ];

    // Mild concern keywords (stress, occasional anxiety)
    const mildKeywords = [
      "stressed",
      "stress",
      "anxious",
      "anxiety",
      "worried",
      "nervous",
      "sad",
      "upset",
      "overwhelmed",
      "tired",
      "exhausted",
    ];

    // Check for urgent concerns
    const hasUrgentConcerns = urgentKeywords.some((keyword) =>
      allUserText.includes(keyword),
    );
    if (hasUrgentConcerns) {
      return {
        status: "urgent",
        label: "Urgent Professional Consultation Recommended",
        color: "text-red-600 dark:text-red-400",
      };
    }

    // Count serious concerns
    const seriousConcernsCount = concernKeywords.filter(
      (keyword) => allUserText.includes(keyword),
    ).length;

    // Multiple serious concerns or repeated mentions
    if (
      seriousConcernsCount >= 3 ||
      (userMessages.length >= 5 && seriousConcernsCount >= 2)
    ) {
      return {
        status: "consultation",
        label: "Professional Consultation Recommended",
        color: "text-orange-600 dark:text-orange-400",
      };
    }

    // Check for mild concerns
    const mildConcernsCount = mildKeywords.filter((keyword) =>
      allUserText.includes(keyword),
    ).length;

    // Frequent mild concerns
    if (mildConcernsCount >= 4) {
      return {
        status: "consultation",
        label: "Professional Consultation Recommended",
        color: "text-orange-600 dark:text-orange-400",
      };
    }

    // Normal - either no concerns or minimal mild concerns
    return {
      status: "normal",
      label: "Normal",
      color: "text-green-600 dark:text-green-400",
    };
  };

  const mentalHealthStatus = evaluateMentalHealth();

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Collapsable Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 border-r border-border bg-card flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header with BAYMAX Logo */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-10 h-10 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground p-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="BAYMAX"
                  className="w-full h-full object-cover rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <h2>BAYMAX</h2>
          </div>
          <Button
            onClick={onNewChat}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSwitchChat(session.id)}
                className={`w-full text-left p-3 rounded-lg hover:bg-accent transition-colors ${
                  currentChat.id === session.id
                    ? "bg-accent"
                    : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={toggleSidebar}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Collapse
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                onClick={toggleSidebar}
                variant="outline"
                size="icon"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            <button
              onClick={toggleProfile}
              className="cursor-pointer"
            >
              <Avatar className="w-10 h-10 border-2 border-primary hover:opacity-80 transition-opacity">
                <AvatarFallback className="bg-primary text-primary-foreground p-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="BAYMAX"
                    className="w-full h-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </button>
            <h1>BAYMAX</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="icon"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.sender === "bot"
                        ? "bg-primary text-primary-foreground p-0"
                        : "bg-secondary"
                    }
                  >
                    {message.sender === "bot" ? (
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="BAYMAX"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col gap-1 max-w-2xl ${
                    message.sender === "user"
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage()
                }
                placeholder="Type your message here..."
                className="flex-1 bg-input-background"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              BAYMAX is an AI assistant. For emergencies, please
              contact emergency services or a healthcare
              professional.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Popup with Blurred Background */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={toggleProfile}
        >
          <div
            className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={toggleProfile}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-20 h-20 border-2 border-primary mb-3">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-center mb-1">My Profile</h2>
              <p className="text-sm text-muted-foreground">
                Personal Information
              </p>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Name
                </label>
                <p className="mt-1">{userProfile.name}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">{userProfile.email}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Age
                </label>
                <p className="mt-1">{userProfile.age} years</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Allergies
                </label>
                <p className="mt-1">
                  {userProfile.allergies || "None specified"}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">
                  Medical History
                </label>
                <p className="mt-1">
                  {userProfile.medicalHistory ||
                    "None specified"}
                </p>
              </div>

              {/* Mental Health Status */}
              <div className="pt-2 border-t border-border">
                <label className="text-sm text-muted-foreground">
                  Mental Health Status
                </label>
                <p
                  className={`mt-1 ${mentalHealthStatus.color}`}
                >
                  {mentalHealthStatus.label}
                </p>
                {mentalHealthStatus.status !==
                  "not-evaluated" &&
                  mentalHealthStatus.status !== "normal" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {mentalHealthStatus.status === "urgent"
                        ? "Please seek immediate professional help. Contact a mental health crisis line or visit your nearest emergency room."
                        : "Consider scheduling an appointment with a mental health professional to discuss your concerns."}
                    </p>
                  )}
                {mentalHealthStatus.status ===
                  "not-evaluated" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Continue chatting with BAYMAX to receive a
                    mental health evaluation.
                  </p>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <Button
                onClick={toggleProfile}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
