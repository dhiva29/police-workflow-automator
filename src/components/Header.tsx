import { Shield, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export const Header = ({ username, onLogout }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tamil Nadu Police</h1>
                <p className="text-sm opacity-90">Control Room - CSR Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <User className="w-3 h-3 mr-1" />
              {username}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-white/30 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};