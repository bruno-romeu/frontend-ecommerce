"use client";

import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react"; 
interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) {
  return (
    <aside className="md:col-span-1">
      <nav className="flex flex-col space-y-2">
        <Button
          variant={activeTab === 'dados' ? 'default' : 'ghost'}
          onClick={() => onTabChange('dados')}
          className="justify-start"
        >
          <User className="mr-2 h-4 w-4" /> Meus Dados
        </Button>
        <Button
          variant={activeTab === 'pedidos' ? 'default' : 'ghost'}
          onClick={() => onTabChange('pedidos')}
          className="justify-start"
        >
          {/* Pode usar outro ícone se preferir, como ListOrdered */}
          <User className="mr-2 h-4 w-4" /> Meus Pedidos 
        </Button>
        <Button 
          variant="ghost" 
          onClick={onLogout} 
          className="justify-start text-red-500 hover:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </nav>
    </aside>
  );
}