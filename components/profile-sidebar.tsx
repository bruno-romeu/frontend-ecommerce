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
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        <Button
          variant={activeTab === 'dados' ? 'default' : 'ghost'}
          onClick={() => onTabChange('dados')}
          className="justify-start whitespace-nowrap flex-shrink-0 md:flex-shrink text-sm sm:text-base"
        >
          <User className="mr-2 h-4 w-4" /> Meus Dados
        </Button>
        <Button
          variant={activeTab === 'pedidos' ? 'default' : 'ghost'}
          onClick={() => onTabChange('pedidos')}
          className="justify-start whitespace-nowrap flex-shrink-0 md:flex-shrink text-sm sm:text-base"
        >
          <User className="mr-2 h-4 w-4" /> Meus Pedidos
        </Button>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="justify-start text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 md:flex-shrink text-sm sm:text-base"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </nav>
    </aside>
  );
}