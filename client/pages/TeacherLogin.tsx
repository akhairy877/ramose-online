import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { teachers } from "@shared/data";

export default function TeacherLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const teacher = teachers.find(
      (t) => t.username === username && t.password === password,
    );

    if (teacher) {
      // Store teacher info in localStorage for the session
      localStorage.setItem("currentTeacher", JSON.stringify(teacher));
      navigate("/teacher/dashboard");
    } else {
      setError("Invalid username or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🏫 Teacher Portal
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Access your student management dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">
              Welcome Back!
            </CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm">
              Sign in to manage your students' progress
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-400"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-3">
                Available Teachers:
              </h4>
              <div className="text-sm text-blue-700 space-y-3">
                <div className="border-b border-blue-200 pb-2">
                  <div>
                    <strong>Ahmed El-Agamy</strong> (Math & Science)
                  </div>
                  <div>
                    <strong>Username:</strong> ahmed.elagamy
                  </div>
                  <div>
                    <strong>Password:</strong> +201015323048
                  </div>
                </div>
                <div className="border-b border-blue-200 pb-2">
                  <div>
                    <strong>Sarah Johnson</strong> (English & Art)
                  </div>
                  <div>
                    <strong>Username:</strong> sarah.johnson
                  </div>
                  <div>
                    <strong>Password:</strong> +201015323048
                  </div>
                </div>
                <div>
                  <div>
                    <strong>Mike Chen</strong> (Physical Education & Music)
                  </div>
                  <div>
                    <strong>Username:</strong> mike.chen
                  </div>
                  <div>
                    <strong>Password:</strong> +201015323048
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Vision Board */}
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                ← Back to Vision Board
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
