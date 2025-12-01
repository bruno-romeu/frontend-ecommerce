import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      category: "Pedidos e Entregas",
      questions: [
        {
          q: "Qual o prazo de entrega?",
          a: "O prazo de entrega varia conforme sua região. Após a confirmação do pagamento, o prazo estimado é de 5 a 15 dias úteis para todo o Brasil. Você pode calcular o frete específico para seu CEP durante o processo de compra."
        },
        {
          q: "Como acompanho meu pedido?",
          a: "Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail. Você também pode acompanhar o status do seu pedido na seção 'Meus Pedidos' em sua conta."
        },
        {
          q: "É possível alterar o endereço de entrega após a compra?",
          a: "Sim, mas apenas antes do envio do pedido. Entre em contato conosco o mais rápido possível através do e-mail contato@balm.com.br ou telefone (51) 99999-9999."
        },
        {
          q: "Vocês entregam em todo o Brasil?",
          a: "Sim! Realizamos entregas para todos os estados brasileiros através dos Correios."
        }
      ]
    },
    {
      category: "Pagamento",
      questions: [
        {
          q: "Quais formas de pagamento são aceitas?",
          a: "Aceitamos pagamentos via Mercado Pago, que inclui cartão de crédito, débito, PIX e boleto bancário. Os pagamentos são 100% seguros e protegidos."
        },
        {
          q: "Posso parcelar minha compra?",
          a: "Sim! Dependendo do valor da compra e da forma de pagamento escolhida, é possível parcelar em até 12x sem juros no cartão de crédito através do Mercado Pago."
        },
        {
          q: "Quando o pagamento é processado?",
          a: "O pagamento é processado imediatamente após a finalização da compra. Para pagamentos via PIX, o pedido é confirmado instantaneamente. Para boleto, a confirmação ocorre em até 2 dias úteis."
        }
      ]
    },
    {
      category: "Produtos",
      questions: [
        {
          q: "As velas são feitas de que material?",
          a: "Nossas velas são 100% artesanais, feitas com cera de soja natural e essências premium de alta qualidade. Não utilizamos parafina ou ingredientes de origem animal."
        },
        {
          q: "Quanto tempo dura uma vela?",
          a: "A duração varia conforme o tamanho da vela e o tempo de uso. Em média, nossas velas de tamanho padrão duram entre 40 a 60 horas de queima. Recomendamos não ultrapassar 4 horas contínuas de uso."
        },
        {
          q: "As fragrâncias são fortes?",
          a: "Sim! Nosso diferencial é oferecer fragrâncias potentes e duradouras. Utilizamos essências de alta concentração para garantir que o aroma se espalhe por todo o ambiente."
        },
        {
          q: "Posso escolher o tamanho e a essência?",
          a: "Sim! Na página de cada produto, você pode selecionar o tamanho desejado e a essência disponível para aquele modelo."
        },
        {
          q: "Como conservar melhor minha vela?",
          a: "Mantenha a vela em local fresco e seco, longe da luz solar direta. Sempre apare o pavio antes de acender (cerca de 0,5cm) e evite correntes de ar durante a queima."
        }
      ]
    },
    {
      category: "Trocas e Devoluções",
      questions: [
        {
          q: "Qual é a política de trocas e devoluções?",
          a: "Você tem até 7 dias após o recebimento para solicitar a troca ou devolução do produto, conforme o Código de Defesa do Consumidor. O produto deve estar em sua embalagem original, sem sinais de uso."
        },
        {
          q: "Como solicito uma troca ou devolução?",
          a: "Entre em contato através do e-mail contato@balm.com.br informando o número do pedido e o motivo da solicitação. Nossa equipe irá orientá-lo sobre os próximos passos."
        },
        {
          q: "Quem paga o frete da devolução?",
          a: "Se o produto apresentar defeito ou divergência, o frete é por nossa conta. Em caso de desistência ou arrependimento, o frete de devolução é de responsabilidade do cliente."
        },
        {
          q: "Quando recebo o reembolso?",
          a: "Após recebermos e analisarmos o produto devolvido, o reembolso é processado em até 10 dias úteis. O prazo para o valor aparecer na fatura pode variar conforme a operadora do cartão."
        }
      ]
    },
    {
      category: "Conta e Cadastro",
      questions: [
        {
          q: "É necessário criar uma conta para comprar?",
          a: "Sim, é necessário criar uma conta para realizar compras em nossa loja. Isso garante a segurança das suas informações e permite acompanhar seus pedidos."
        },
        {
          q: "Esqueci minha senha. O que faço?",
          a: "Na página de login, clique em 'Esqueci minha senha' e siga as instruções para redefinir sua senha através do e-mail cadastrado."
        },
        {
          q: "Como altero meus dados cadastrais?",
          a: "Acesse sua conta, vá em 'Meu Perfil' e clique em 'Editar' para atualizar suas informações pessoais e endereços."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      <main className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg text-default">
              Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section, idx) => (
              <div key={idx}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, qIdx) => (
                    <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-dafault">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-primary/10 rounded-lg text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-3">
              Não encontrou o que procurava?
            </h3>
            <p className="text-secondary mb-4">
              Entre em contato conosco e teremos prazer em ajudá-lo!
            </p>
            <a
              href="/contato"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Falar Conosco
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}