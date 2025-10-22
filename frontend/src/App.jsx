import React, { useState, useEffect, useRef } from 'react';
import { Bot, ArrowLeft, Check, X, LogOut, Send, User, Clock, Moon, Sun, Menu, Plus, MessageSquare, ChevronLeft } from 'lucide-react';

// --- Integrated UI Components (from your new design) ---

const Card = ({ children, className }) => <div className={`border bg-card text-card-foreground rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;
const CardDescription = ({ children, className }) => <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Input = React.forwardRef(({ className, ...props }, ref) => <input ref={ref} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />);
const Button = ({ children, className, variant, size, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'} ${className}`} {...props}>{children}</button>;
const Label = ({ children, className, ...props }) => <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`} {...props}>{children}</label>;
const Textarea = React.forwardRef(({ className, ...props }, ref) => <textarea ref={ref} className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />);
const Avatar = ({ children, className }) => <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarFallback = ({ children, className }) => <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</div>;
const ScrollArea = React.forwardRef(({ children, className, ...props }, ref) => <div ref={ref} className={`relative overflow-y-auto h-full w-full ${className}`} {...props}>{children}</div>);


// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  // --- Login Component ---
  const Login = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || 'Login failed');
        }
        setToken(data.token);
        setCurrentUser(data.user);
        setCurrentPage('chat');
      } catch (err) {
        setError(err.message);
      }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-background">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
                <img src="https://images.unsplash.com/photo-1604881991720-f91add269bed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBzdXBwb3J0fGVufDF8fHx8MTc2MDcwMTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080" alt="Mental health support" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-64 h-64 object-contain drop-shadow-2xl" />
                    <h1 className="text-6xl mb-4 font-bold">BAYMAX</h1>
                    <p className="text-xl text-center max-w-md opacity-90">Your AI-powered mental health companion. Get personalized support and guidance anytime, anywhere.</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center lg:hidden"><div className="flex items-center justify-center gap-2 mb-4"><Bot className="w-8 h-8 text-primary" /><h1 className="text-3xl font-bold">BAYMAX</h1></div></div>
                    <Card><CardHeader><CardTitle>Welcome Back</CardTitle><CardDescription>Sign in to continue your mental health journey</CardDescription></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                                <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                <div className="flex items-center justify-between"><a href="#" className="text-sm text-primary hover:underline">Forgot password?</a></div>
                                <Button type="submit" className="w-full">Sign In</Button>
                            </form>
                            <div className="mt-6 text-center"><p className="text-sm text-muted-foreground">Don't have an account?{' '}<button onClick={onSwitchToRegister} className="text-primary hover:underline font-semibold">Sign up</button></p></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
  };

  // --- Register Component ---
  const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', age: '', medicalHistory: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match!');
        }
        try {
            const { name, email, password, age, medicalHistory } = formData;
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, age, medicalHistory })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }
            setToken(data.token);
            setCurrentUser(data.user);
            setCurrentPage('chat');
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
        <div className="h-screen w-full flex overflow-hidden bg-background">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 to-blue-700">
                 <img src="https://images.unsplash.com/photo-1758691463110-697a814b2033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNjg4Mjc5fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Healthcare technology" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-64 h-64 object-contain drop-shadow-2xl" />
                    <h1 className="text-6xl mb-4 font-bold">BAYMAX</h1>
                    <p className="text-xl text-center max-w-md opacity-90">Join thousands of users who trust BAYMAX for personalized mental health support.</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-hidden">
                <div className="flex-shrink-0 p-6 pb-0"><button onClick={onSwitchToLogin} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to login</button></div>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="w-full max-w-md mx-auto pt-6">
                        <Card><CardHeader><CardTitle>Create Your Account</CardTitle><CardDescription>Begin your mental health journey with BAYMAX</CardDescription></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required /></div>
                                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required /></div>
                                    <div className="space-y-2"><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" placeholder="25" value={formData.age} onChange={handleChange} required min="13" max="120" /></div>
                                    <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required /></div>
                                    <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required /></div>
                                    <div className="space-y-2"><Label htmlFor="medicalHistory">Medical History</Label><Textarea id="medicalHistory" name="medicalHistory" placeholder="Describe any past conditions or relevant health information" value={formData.medicalHistory} onChange={handleChange} rows={3} /></div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                    <div className="pt-1"><Button type="submit" className="w-full">Create Account</Button></div>
                                </form>
                                <div className="mt-4 text-center"><p className="text-sm text-muted-foreground">Already have an account?{' '}<button onClick={onSwitchToLogin} className="text-primary hover:underline font-semibold">Sign in</button></p></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  // --- Chat Page Component ---
  const ChatPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [chatHistory]);
    
    useEffect(() => {
        if (chatHistory.length === 0) {
            setChatHistory([{
                sender: 'bot',
                content: "Hello! I'm BAYMAX, your personal mental health companion. How are you feeling today?",
                timestamp: new Date()
            }]);
        }
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { sender: 'user', content: inputValue, timestamp: new Date() };
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: inputValue })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to get response from AI');

            const botResponse = { sender: 'bot', content: data.reply, timestamp: new Date() };
            setChatHistory([...newHistory, botResponse]);
        } catch (err) {
            const errorResponse = { sender: 'bot', content: `Sorry, something went wrong: ${err.message}`, timestamp: new Date() };
            setChatHistory([...newHistory, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogout = () => {
        setToken(null);
        setCurrentUser(null);
        setCurrentPage('login');
    };

    return (
        <div className="flex h-screen w-full bg-background text-foreground">
            <div className="hidden md:flex w-64 border-r border-border bg-card flex-col">
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4"><Avatar className="w-10 h-10 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground p-0"><img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /></AvatarFallback></Avatar><h2 className="font-bold">BAYMAX</h2></div>
                    <Button className="w-full flex items-center gap-2"><Plus className="w-4 h-4" />New Chat</Button>
                </div>
                <ScrollArea><div className="p-2 space-y-1"></div></ScrollArea>
                <div className="p-4 border-t border-border"><Button variant="outline" className="w-full flex items-center gap-2"><ChevronLeft className="w-4 h-4" />Collapse</Button></div>
            </div>
            <div className="flex flex-col flex-1 h-screen">
                <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground p-0"><img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /></AvatarFallback></Avatar>
                        <h1 className="font-bold">BAYMAX</h1>
                    </div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="icon"><Sun className="w-4 h-4" /></Button><Button onClick={handleLogout} variant="outline" size="icon"><LogOut className="w-4 h-4" /></Button></div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto space-y-6">
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className={message.sender === 'bot' ? 'bg-primary text-primary-foreground p-0' : 'bg-secondary'}>{message.sender === 'bot' ? <img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /> : <User className="w-4 h-4" />}</AvatarFallback></Avatar>
                                <div className={`flex flex-col gap-1 max-w-2xl ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`rounded-2xl px-4 py-3 shadow-md ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><p>{message.content}</p></div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground px-2"><Clock className="w-3 h-3" />{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                        ))}
                         {isLoading && <div className="flex gap-3 flex-row"><Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className='bg-primary text-primary-foreground p-0'><img src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="BAYMAX" className="w-full h-full object-cover rounded-full" /></AvatarFallback></Avatar><div className="flex flex-col gap-1 max-w-2xl items-start"><div className="rounded-2xl px-4 py-3 bg-muted shadow-md"><p>Baymax is thinking...</p></div></div></div>}
                    </div>
                </div>
                <div className="border-t border-border bg-card p-4 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto"><div className="flex gap-2"><Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)} placeholder="Type your message here..." className="flex-1" /><Button type="submit" size="icon"><Send className="w-4 h-4" /></Button></div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">BAYMAX is an AI assistant and not a replacement for a therapist. For emergencies, please contact a healthcare professional.</p>
                    </form>
                </div>
            </div>
        </div>
    );
  };
  
  // --- Page Router ---
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'chat':
        return <ChatPage />;
      default:
        return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
    }
  };

  return <div className="h-screen w-full">{renderPage()}</div>;
}

