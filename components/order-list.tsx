"use client";

import { useState } from "react";
import { ChevronDown, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: number;
  name: string;
  price: string | number;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string | number;
}

interface ShippingInfo {
  id: number;
  tracking_code?: string;
  carrier?: string;
  estimated_delivery?: string;
  status: string;
}

interface PaymentInfo {
  id: number;
  method: string;
  status: string;
  paid_at?: string;
}

export interface Order {
  id: number;
  status: string;
  total: string | number;
  created_at: string;
  items: OrderItem[];
  shipping?: ShippingInfo;
  payment?: PaymentInfo;
}

interface OrdersListProps {
  orders: Order[];
  onCancel: (orderId: number) => Promise<void>;
}

const statusConfig: Record<string, {
  label: string;
  icon: any;
  badgeVariant: "default" | "outline" | "destructive";
}> = {
  pending: {
    label: "Pendente",
    icon: Clock,
    badgeVariant: "outline",
  },
  paid: {
    label: "Pago",
    icon: CheckCircle,
    badgeVariant: "default",
  },
  shipped: {
    label: "Enviado",
    icon: Truck,
    badgeVariant: "default",
  },
  delivered: {
    label: "Entregue",
    icon: CheckCircle,
    badgeVariant: "default",
  },
  canceled: {
    label: "Cancelado",
    icon: AlertCircle,
    badgeVariant: "destructive",
  },
};

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onCancel: (orderId: number) => Promise<void>;
  isCanceling: boolean;
}

function OrderCard({ order, isExpanded, onToggle, onCancel, isCanceling }: OrderCardProps) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const IconComponent = config.icon;
  const itemCount = order.items?.length || 0;
  const canCancel = ["pending", "paid"].includes(order.status);
  const total = typeof order.total === "string" 
    ? parseFloat(order.total).toFixed(2) 
    : order.total.toFixed(2);

  const handleCancelClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onCancel(order.id);
  };

  return (
    <Card className="bg-card border-border">
      <div
        className="cursor-pointer p-4 sm:p-6 transition-colors hover:bg-secondary/5"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <IconComponent className="w-5 h-5 flex-shrink-0 text-foreground" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-base">Pedido #{order.id}</p>
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.label}
                </Badge>
              </div>
              <p className="text-xs font-bold sm:text-sm text-muted mt-1">
                {new Date(order.created_at).toLocaleDateString("pt-BR")} •{" "}
                {itemCount} item{itemCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-base sm:text-lg">
              R$ {total.replace(".", ",")}
            </p>
            <ChevronDown
              className={`w-5 h-5 transition-transform ml-auto text-muted-foreground ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          <Separator />
          <CardContent className="pt-4 sm:pt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-3">Itens do Pedido</h4>
              <div className="space-y-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-xs sm:text-sm"
                    >
                      <span className="text-foreground font-semibold">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-sm font-bold">
                        Produtos: R${" "}
                        {(typeof item.price === "string" 
                          ? parseFloat(item.price) 
                          : item.price
                        ).toFixed(2).replace(".", ",")}
                        <p>
                          Frete: R${" "}
                          
                        </p>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground">Nenhum item encontrado</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {order.payment && (
                <div className="bg-secondary/5 p-3 rounded-md border border-border">
                  <p className="text-xs text-foreground font-semibold mb-1">
                    Pagamento
                  </p>
                  <p className="text-xs font-semibold text-accent">
                    {order.payment.method}
                  </p>
                  <p className="text-xs text-foreground font-normal mt-1">
                    {order.payment.status === "paid"
                      ? "Pago"
                      : "Aguardando"}
                  </p>
                </div>
              )}

              {order.shipping && (
                <div className="bg-secondary/5 p-3 rounded-md border border-border">
                  <p className="text-xs text-foreground font-semibold mb-1">
                    Envio
                  </p>
                  <p className="text-xs font-semibold text-accent">
                    {order.shipping.carrier || "N/A"}
                  </p>
                  <p className="text-xs text-foreground font-normal mt-1">
                    {order.shipping.status === "shipped"
                      ? "Enviado"
                      : "Processando"}
                  </p>
                </div>
              )}
            </div>

            {order.shipping?.tracking_code && (
              <div className="bg-secondary/5 p-3 rounded-md border border-border">
                <p className="text-xs text-foreground font-semibold mb-1">
                  Código de Rastreamento
                </p>
                <p className="text-xs font-semibold text-accent">
                  {order.shipping.tracking_code}
                </p>
                {order.shipping.estimated_delivery && (
                  <p className="text-xs text-foreground font-normal mt-1">
                    Entrega estimada:{" "}
                    {new Date(
                      order.shipping.estimated_delivery
                    ).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs sm:text-sm"
              >
                Ver Detalhes
              </Button>
              {canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCanceling}
                  className="flex-1 text-xs sm:text-sm text-destructive hover:bg-destructive hover:text-white"
                  onClick={handleCancelClick}
                >
                  {isCanceling ? "Cancelando..." : "Cancelar"}
                </Button>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

export function OrdersList({ orders = [], onCancel }: OrdersListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    canceled: orders.filter((o) => o.status === "canceled").length,
  };

  const handleCancelClick = async (orderId: number) => {
    setCancelingId(orderId);
    try {
      await onCancel(orderId);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          Meus Pedidos
        </h2>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendentes" },
            { key: "paid", label: "Pagos" },
            { key: "shipped", label: "Enviados" },
            { key: "delivered", label: "Entregues" },
            { key: "canceled", label: "Cancelados" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
              className="text-xs sm:text-sm"
            >
              {label}
              {statusCounts[key as keyof typeof statusCounts] > 0 && (
                <span className="ml-2 text-xs font-semibold opacity-70">
                  ({statusCounts[key as keyof typeof statusCounts]})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-foreground text-sm">
              {orders.length === 0
                ? "Você não tem pedidos ainda"
                : "Nenhum pedido encontrado neste filtro"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId(expandedId === order.id ? null : order.id)
              }
              onCancel={handleCancelClick}
              isCanceling={cancelingId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}