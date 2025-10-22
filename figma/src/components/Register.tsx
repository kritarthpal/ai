import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Bot, ArrowLeft, Check, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfile {
  name: string;
  email: string;
  age: string;
  allergies: string;
  medicalHistory: string;
}

interface RegisterProps {
  onRegister: (userData: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    allergies: '',
    medicalHistory: ''
  });

  // Password validation
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!isPasswordValid) {
      alert('Please ensure your password meets all requirements');
      return;
    }
    
    if (!passwordsMatch) {
      alert('Passwords do not match!');
      return;
    }
    
    // Pass user data to parent component
    onRegister({
      name: formData.name,
      email: formData.email,
      age: formData.age,
      allergies: formData.allergies,
      medicalHistory: formData.medicalHistory
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 to-blue-700">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758691463110-697a814b2033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNjg4Mjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Healthcare technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="mb-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1738054026804-cf9061a32dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXltYXglMjByb2JvdCUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjA4MDcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="BAYMAX"
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-6xl mb-4">BAYMAX</h1>
          <p className="text-xl text-center max-w-md opacity-90">
            Join thousands of users who trust BAYMAX for personalized mental health support.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background h-screen overflow-hidden">
        <div className="flex-shrink-0 p-6 pb-0">
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          <div className="mt-6 text-center lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-8 h-8 text-primary" />
              <h1 className="text-3xl">BAYMAX</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="w-full max-w-md mx-auto pt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>Begin your mental health journey with BAYMAX</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`bg-input-background pr-10 ${
                        formData.email && (isEmailValid ? 'border-green-500' : 'border-red-500')
                      }`}
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isEmailValid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.email && !isEmailValid && (
                    <p className="text-xs text-red-500">Please enter a valid email address</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="13"
                    max="120"
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-input-background"
                  />
                  {formData.password && (
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordValidation.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordValidation.hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordValidation.hasLowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordValidation.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>One number</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordValidation.hasSpecialChar ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>One special character (!@#$%^&*...)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`bg-input-background pr-10 ${
                        formData.confirmPassword && (passwordsMatch ? 'border-green-500' : 'border-red-500')
                      }`}
                    />
                    {formData.confirmPassword && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (if any)</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    placeholder="List any known allergies to medications, foods, etc."
                    value={formData.allergies}
                    onChange={handleChange}
                    className="bg-input-background resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    placeholder="Describe any past medical procedures, conditions, or relevant health information"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="bg-input-background resize-none"
                    rows={3}
                  />
                </div>

                <div className="pt-1">
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy. Your medical information is encrypted and secure.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
