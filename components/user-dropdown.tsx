"use client"
import { User, LogIn, UserPlus, Package, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface UserDropdownProps {
  isLoggedIn: boolean
}

export function UserDropdown({ isLoggedIn }: UserDropdownProps) {
  const { user, logout } = useAuth();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary">
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isLoggedIn && user ? (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Minha Conta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/perfil?tab=pedidos" className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                Meus Pedidos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={true}>
              <Link href="/lista-desejos" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                Lista de Desejos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cadastro" className="cursor-pointer">
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Conta
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
