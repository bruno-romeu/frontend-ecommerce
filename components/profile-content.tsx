"use client"

import { useState } from "react"
import { MyDataSection } from "@/components/my-data-section"
import { MyOrdersSection } from "@/components/my-orders-section"

export function ProfileContent() {
  const [activeSection, setActiveSection] = useState("dados")

  return (
    <div>
      {activeSection === "dados" && <MyDataSection />}
      {activeSection === "pedidos" && <MyOrdersSection />}
    </div>
  )
}
