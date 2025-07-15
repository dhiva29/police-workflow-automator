import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CSRDashboard } from "@/components/CSRDashboard";
import { ResponseHandler } from "@/components/ResponseHandler";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header username={username} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && <CSRDashboard />}
          {activeTab === "responses" && <ResponseHandler />}
        </main>
      </div>
    </div>
  );
};

export default Index;
