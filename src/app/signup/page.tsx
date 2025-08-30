"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up:", formData);
    // TODO: Implement sign up logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Panel - Sign Up Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Back Button */}
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to home</span>
              </Link>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Create your account
                </h1>
                <p className="text-slate-600">
                  Join the global acro yoga community
                </p>
              </div>

              {/* Social Sign Up */}
              <Button 
                variant="outline" 
                className="w-full mb-6 h-12 bg-white hover:bg-slate-50 border-slate-200"
              >
                <Image
                  src="/google-logo.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <span>Sign up with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-slate-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-slate-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-primary focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                >
                  Create account
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Illustration & AI Prompt */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="text-center max-w-md">
              {/* 3D Illustration Placeholder */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Welcome to AcroWorld
                </h3>
                <p className="text-slate-600">
                  Your gateway to the global acro yoga community
                </p>
              </div>

              {/* AI Prompt Box */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="text-left">
                    <p className="text-sm text-slate-700 mb-3">
                      "Join thousands of acro yoga practitioners worldwide. Discover workshops, connect with teachers, and build meaningful relationships in our vibrant community."
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Badge variant="secondary" className="text-xs">
                        Community
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Global
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Authentic
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">500+ events worldwide</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">100+ expert teachers</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">10K+ community members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
