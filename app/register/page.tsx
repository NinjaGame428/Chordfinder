"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslatedRoute } from "@/lib/url-translations";
import LanguageSwitcher from "@/components/language-switcher";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const { t, language } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        // Small delay to ensure auth state updates before redirect
        setTimeout(() => {
          router.push(getTranslatedRoute("/dashboard", language));
        }, 100);
      } else {
        setError(t('auth.registrationFailed'));
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(t('auth.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Image - Shows on mobile, hidden on desktop */}
      <div className="lg:hidden w-full h-64 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/signup%20image.png')",
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 text-white">
          <h2 className="text-2xl font-bold text-center">{t('auth.welcomeToPhinAccords')}</h2>
          <p className="text-sm text-white/90 text-center mt-2">
            {t('auth.joinMusicians')}
          </p>
        </div>
      </div>

      {/* Left Column - Full Screen Image (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/signup%20image.png')",
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold">{t('auth.welcomeToPhinAccords')}</h2>
            <p className="text-lg text-white/90">
              {t('auth.joinMusicians')}
            </p>
            <ul className="space-y-3 text-left list-none">
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span>{t('auth.accessChords')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span>{t('auth.interactiveDiagrams')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span>{t('auth.saveFavorites')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link href={getTranslatedRoute('/', language)} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('auth.backToHome')}
              </Link>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center space-x-2 lg:hidden">
              <Music className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">HeavenKeys</h1>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('auth.createAccountTitle')}</h1>
              <p className="text-muted-foreground mt-1">{t('auth.startJourney')}</p>
            </div>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{t('auth.signUp')}</CardTitle>
              <CardDescription>
                {t('auth.createAccountDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('auth.createPassword')}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={t('auth.confirmYourPassword')}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-destructive text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')} </span>
                <Link href={getTranslatedRoute('/login', language)} className="text-primary hover:underline">
                  {t('auth.signIn')}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            {t('auth.builtBy')}{" "}
            <Link 
              href="https://heavenkeys.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Heavenkeys Ltd
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}