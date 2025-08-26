import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAdminByCredentials } from "@shared/data";

export default function AdminLogin() {
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

    const admin = getAdminByCredentials(username, password);

    if (admin) {
      // Store admin info in localStorage for the session
      localStorage.setItem("currentAdmin", JSON.stringify(admin));
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            🔐 Admin Portal
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            System Administration Access
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">
              Administrator Login
            </CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm">
              Access the admin dashboard to manage teachers and subjects
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
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-orange-200 focus:border-orange-400"
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
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-orange-200 focus:border-orange-400"
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
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Access Admin Dashboard"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="text-sm font-medium text-orange-800 mb-2">
                Demo Admin Credentials:
              </h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div>
                  <strong>Username:</strong> admin
                </div>
                <div>
                  <strong>Password:</strong> admin123
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/teacher/login")}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                Teacher Login →
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
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
