"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Package, LogOut } from "lucide-react"

const menuItems = [
  { id: "dados", label: "Meus Dados", icon: User },
  { id: "pedidos", label: "Meus Pedidos", icon: Package },
]

export function ProfileSidebar() {
  const [activeSection, setActiveSection] = useState("dados")

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log("Logging out...")
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}

          <div className="border-t pt-2 mt-2">
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
