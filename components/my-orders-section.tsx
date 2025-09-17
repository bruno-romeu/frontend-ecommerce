import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock orders data - in a real app, this would come from an API
const orders = [
  {
    id: "PED-2024-001",
    date: "2024-01-15",
    total: 179.8,
    status: "Entregue",
    statusColor: "bg-green-100 text-green-800",
    items: [{ name: "Vela Lavanda Francesa", quantity: 2, price: 89.9 }],
  },
  {
    id: "PED-2024-002",
    date: "2024-01-20",
    total: 249.7,
    status: "Em Trânsito",
    statusColor: "bg-blue-100 text-blue-800",
    items: [
      { name: "Kit Relaxamento", quantity: 1, price: 199.9 },
      { name: "Home Spray Citrus Fresh", quantity: 1, price: 59.9 },
    ],
  },
  {
    id: "PED-2024-003",
    date: "2024-01-25",
    total: 79.9,
    status: "Processando",
    statusColor: "bg-yellow-100 text-yellow-800",
    items: [{ name: "Vela Eucalipto & Menta", quantity: 1, price: 79.9 }],
  },
]

export function MyOrdersSection() {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">Você ainda não fez nenhum pedido. Que tal começar agora?</p>
            <Link href="/produtos">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Ver Produtos</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Meus Pedidos</h2>
        <p className="text-muted-foreground">{orders.length} pedidos encontrados</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-serif text-lg">Pedido {order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Realizado em {new Date(order.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={order.statusColor}>{order.status}</Badge>
                  <p className="font-semibold">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Itens do pedido:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {order.status === "Entregue" && (
                    <Button variant="outline" size="sm">
                      Comprar Novamente
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
