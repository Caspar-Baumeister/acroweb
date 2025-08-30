"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Heart, Users, Globe } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
    console.log("Sign in:", formData);
    // TODO: Implement sign in logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Panel - Sign In Form */}
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
                  Welcome back
                </h1>
                <p className="text-slate-600">
                  Sign in to your AcroWorld account
                </p>
              </div>

              {/* Social Sign In */}
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
                <span>Sign in with Google</span>
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
                      placeholder="Enter your password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="remember" className="text-sm text-slate-600">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                >
                  Sign in
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Community & Features */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="text-center max-w-md">
              {/* Community Illustration */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Reconnect with Community
                </h3>
                <p className="text-slate-600">
                  Access your personalized acro yoga journey
                </p>
              </div>

              {/* Community Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-emerald-600">12</div>
                      <div className="text-xs text-slate-600">Events Attended</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">8</div>
                      <div className="text-xs text-slate-600">Teachers Met</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">156</div>
                      <div className="text-xs text-slate-600">Community Hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Personalized event recommendations</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Global community connections</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Track your progress & achievements</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Browse Events
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Find Teachers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
