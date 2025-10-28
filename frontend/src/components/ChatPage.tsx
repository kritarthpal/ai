import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, Send, User, Clock, Moon, Sun, X, Menu, Plus, MessageSquare, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback'; // Assuming this component exists

// --- Type Definitions (Essential for TypeScript) ---
interface Message {
  id?: string; // Optional: ID might come from backend later
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface UserProfile {
  name: string;
  email: string;
  age: string; // Keep as string if that's how it's handled, or change to number
  // allergies: string; // Removed in previous steps
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
  onUpdateChat: (chatId: string, messages: Message[]) => void; // Function to update messages in App.tsx state
  onNewChat: () => void;
  onSwitchChat: (chatId: string) => void;
  token: string | null; // --- INTEGRATION: Need the token for API calls ---
}

export function ChatPage({
  onLogout,
  userProfile,
  currentChat,
  chatSessions,
  onUpdateChat,
  onNewChat,
  onSwitchChat,
  token // Destructure the token prop
}: ChatPageProps) {
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Basic dark mode state
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Assuming sidebar starts open
  const [isLoading, setIsLoading] = useState(false); // State for AI loading indicator
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Type for useRef

  // Effect to scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentChat.messages]); // Dependency is the messages array

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark"); // Toggles class on the HTML element
  };

  // Functions to toggle UI elements
  const toggleProfile = () => setShowProfile(!showProfile);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // --- INTEGRATION: Updated handleSendMessage to call backend AI ---
  const handleSendMessage = async (e?: React.FormEvent) => { // Optional event parameter
    if (e) e.preventDefault(); // Prevent form submission if called from form submit
    if (!inputValue.trim() || !token) return; // Don't send empty messages or if not logged in

    const userMessage: Message = {
      // id can be omitted, let backend/db handle it if necessary
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // Optimistically update the UI with the user's message immediately
    const newMessages = [...currentChat.messages, userMessage];
    onUpdateChat(currentChat.id, newMessages); // Update state in App.tsx

    const messageToSend = inputValue; // Store message before clearing input
    setInputValue(""); // Clear the input field
    setIsLoading(true); // Show the "thinking" indicator

    try {
      // --- INTEGRATION: Call the backend /api/chat endpoint ---
      const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Send the user's auth token
          },
          body: JSON.stringify({ message: messageToSend }) // Send the message content
      });

      const data = await response.json();
      if (!response.ok) {
          // If the backend returns an error, throw it to be caught below
          throw new Error(data.msg || 'Failed to get response from AI');
      }

      // --- INTEGRATION: Add the AI's actual response from the backend ---
      const botResponse: Message = {
          // id can be omitted
          content: data.reply, // Use the 'reply' field from the backend response
          sender: "bot",
          timestamp: new Date(),
      };
      // Update the state in App.tsx with the bot's response
      onUpdateChat(currentChat.id, [...newMessages, botResponse]);

    } catch (err) {
       // --- INTEGRATION: Display error message in the chat if API call fails ---
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
       const errorResponse: Message = {
           // id can be omitted
           content: `Sorry, something went wrong: ${errorMessage}`,
           sender: "bot",
           timestamp: new Date(),
       };
       // Update the state in App.tsx with the error message
       onUpdateChat(currentChat.id, [...newMessages, errorResponse]);
    } finally {
        setIsLoading(false); // Hide the "thinking" indicator
    }
  };
  // --- End INTEGRATION ---

   // --- Mock Mental Health Evaluation (Keep as is for now, could be replaced later) ---
   const evaluateMentalHealth = (): { status: string; label: string; color: string } => {
        const userMessages = currentChat.messages.filter((msg) => msg.sender === "user");
        if (userMessages.length < 3) return { status: "not-evaluated", label: "Not Evaluated", color: "text-muted-foreground" };
        const allUserText = userMessages.map((msg) => msg.content.toLowerCase()).join(" ");
        // Keywords remain the same as your original file
        const urgentKeywords = ["suicide", "suicidal", "kill myself", "end my life", "want to die", "self harm", "hurt myself", "cutting", "overdose", "no reason to live", "better off dead", "can't go on"];
        const concernKeywords = ["depressed", "depression", "hopeless", "helpless", "worthless", "panic attack", "severe anxiety", "can't cope", "breakdown", "trauma", "ptsd", "intrusive thoughts", "constantly anxious", "can't sleep", "insomnia", "nightmares", "overwhelming"];
        const mildKeywords = ["stressed", "stress", "anxious", "anxiety", "worried", "nervous", "sad", "upset", "overwhelmed", "tired", "exhausted"];
        if (urgentKeywords.some((keyword) => allUserText.includes(keyword))) return { status: "urgent", label: "Urgent Professional Consultation Recommended", color: "text-red-600 dark:text-red-400" };
        const seriousConcernsCount = concernKeywords.filter((keyword) => allUserText.includes(keyword)).length;
        if (seriousConcernsCount >= 3 || (userMessages.length >= 5 && seriousConcernsCount >= 2)) return { status: "consultation", label: "Professional Consultation Recommended", color: "text-orange-600 dark:text-orange-400" };
        const mildConcernsCount = mildKeywords.filter((keyword) => allUserText.includes(keyword)).length;
        if (mildConcernsCount >= 4) return { status: "consultation", label: "Professional Consultation Recommended", color: "text-orange-600 dark:text-orange-400" };
        return { status: "normal", label: "Normal", color: "text-green-600 dark:text-green-400" };
    };
    const mentalHealthStatus = evaluateMentalHealth();


  // --- JSX Structure (Keep your original beautiful UI) ---
  return (
    <div className={`flex h-screen w-full bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${ sidebarOpen ? "w-64" : "w-0" } transition-all duration-300 border-r border-border bg-card flex flex-col overflow-hidden`}>
           <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-10 h-10 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground p-0"><ImageWithFallback src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /></AvatarFallback></Avatar>
                    <h2 className="font-semibold text-lg">BAYMAX</h2> {/* Added font-semibold and text-lg */}
                </div>
                {/* --- INTEGRATION: Make New Chat button work --- */}
                <Button onClick={onNewChat} className="w-full flex items-center gap-2">
                    <Plus className="w-4 h-4" />New Chat
                </Button>
            </div>
            {/* --- INTEGRATION: Display Chat History in Sidebar --- */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {chatSessions.map((session) => (
                        <button key={session.id} onClick={() => onSwitchChat(session.id)} className={`w-full text-left p-3 rounded-lg hover:bg-accent transition-colors ${ currentChat.id === session.id ? "bg-accent" : ""}`}>
                            <div className="flex items-start gap-2"><MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" /> {/* Added color */}
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium">{session.title}</p> {/* Added font-medium */}
                                    <p className="text-xs text-muted-foreground">{session.createdAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
             {/* --- INTEGRATION: Make Collapse button work --- */}
            <div className="p-4 border-t border-border">
                <Button onClick={toggleSidebar} variant="outline" className="w-full flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />Collapse
                </Button>
            </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
            {/* Header */}
            <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* --- INTEGRATION: Show Menu button when sidebar collapsed --- */}
                    {!sidebarOpen && (
                        <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden"> {/* Show only on mobile when collapsed */}
                           <Menu className="w-5 h-5" />
                        </Button>
                    )}
                     {/* --- INTEGRATION: Make avatar clickable for profile --- */}
                    <button onClick={toggleProfile} className="cursor-pointer">
                        <Avatar className="w-10 h-10 border-2 border-primary hover:opacity-80 transition-opacity">
                            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                                {/* Display user initials */}
                                {userProfile?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5"/>}
                                </AvatarFallback>
                        </Avatar>
                    </button>
                    {/* Display current chat title or user name */}
                    <h1 className="font-semibold text-lg">{currentChat?.title || userProfile?.name || 'Chat'}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* --- INTEGRATION: Make dark mode toggle functional --- */}
                    <Button onClick={toggleDarkMode} variant="ghost" size="icon">
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                     {/* --- INTEGRATION: Logout button --- */}
                    <Button onClick={onLogout} variant="ghost" size="icon">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6 bg-gray-50 dark:bg-gray-900" ref={scrollAreaRef}> {/* Added background color */}
                 <div className="max-w-4xl mx-auto space-y-6">
                    {currentChat.messages.map((message, index) => ( // Use index as key if message.id is not reliable
                        <div key={message.id || index} className={`flex gap-3 ${ message.sender === "user" ? "justify-end" : "justify-start"}`}> {/* Use justify-end/start */}
                            {/* Conditionally render AI avatar */}
                            {message.sender === 'bot' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback className='bg-primary text-primary-foreground p-0'>
                                        <ImageWithFallback src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib.rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`flex flex-col gap-1 max-w-[75%] ${ message.sender === "user" ? "items-end" : "items-start"}`}> {/* Limit width */}
                                <div className={`rounded-2xl px-4 py-3 shadow-md ${ message.sender === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"}`}> {/* Different corner rounding */}
                                    {/* Format multi-line messages */}
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                                    <Clock className="w-3 h-3" />
                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}
                                </div>
                            </div>
                             {/* Conditionally render User avatar */}
                             {message.sender === 'user' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback className='bg-secondary text-secondary-foreground font-semibold'>
                                        {userProfile?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4"/>}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {/* --- INTEGRATION: Loading indicator --- */}
                    {isLoading && (
                         <div className="flex gap-3 justify-start"> {/* Use justify-start */}
                             <Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className='bg-primary text-primary-foreground p-0'><ImageWithFallback src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib.rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /></AvatarFallback></Avatar>
                             <div className="flex flex-col gap-1 items-start">
                                <div className="rounded-2xl px-4 py-3 bg-muted text-foreground rounded-bl-none shadow-md">
                                    {/* Animated typing dots */}
                                    <div className="flex space-x-1 items-center h-5">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-card p-4 flex-shrink-0">
                {/* --- INTEGRATION: Use form for submission and Enter key --- */}
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 items-center"> {/* Use items-center */}
                        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your message here..." className="flex-1 bg-input-background" disabled={isLoading} />
                        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}><Send className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">BAYMAX is an AI assistant and not a replacement for a therapist. For emergencies, please contact a healthcare professional.</p>
                </form>
            </div>
      </div>

      {/* Profile Popup */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={toggleProfile}>
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={toggleProfile} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-20 h-20 border-2 border-primary mb-3"><AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">{userProfile?.name?.charAt(0).toUpperCase() || <User className="w-10 h-10" />}</AvatarFallback></Avatar>
                    <h2 className="text-xl font-semibold text-center mb-1">My Profile</h2>
                    <p className="text-sm text-muted-foreground">Personal Information</p>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"> {/* Added max-height and scroll */}
                    <div><Label className="text-xs text-muted-foreground">Name</Label><p className="mt-1">{userProfile.name}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Email</Label><p className="mt-1">{userProfile.email}</p></div>
                    <div><Label className="text-xs text-muted-foreground">Age</Label><p className="mt-1">{userProfile.age} years</p></div>
                    {/* <div><Label className="text-xs text-muted-foreground">Allergies</Label><p className="mt-1">{userProfile.allergies || "None specified"}</p></div> */}
                    <div><Label className="text-xs text-muted-foreground">Medical History</Label><p className="mt-1">{userProfile.medicalHistory || "None specified"}</p></div>
                    <div className="pt-2 border-t border-border">
                        <Label className="text-xs text-muted-foreground">Mental Health Status (Based on current chat)</Label>
                        <p className={`mt-1 font-medium ${mentalHealthStatus.color}`}>{mentalHealthStatus.label}</p>
                        {mentalHealthStatus.status !== "not-evaluated" && mentalHealthStatus.status !== "normal" && ( <p className="text-xs text-muted-foreground mt-2">{mentalHealthStatus.status === "urgent" ? "Please seek immediate professional help. Contact a mental health crisis line or visit your nearest emergency room." : "Consider scheduling an appointment with a mental health professional to discuss your concerns."}</p>)}
                        {mentalHealthStatus.status === "not-evaluated" && (<p className="text-xs text-muted-foreground mt-2">Continue chatting with BAYMAX to receive a mental health evaluation.</p>)}
                    </div>
                </div>
                <div className="mt-6"><Button onClick={toggleProfile} className="w-full" variant="outline">Close</Button></div> {/* Changed button variant */}
            </div>
        </div>
      )}
       {/* Global styles for animations (Add if not already present) */}
      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
        .delay-75 { animation-delay: 0.075s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}

