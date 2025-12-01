export default function TermosPage() {
  return (
    <div className="min-h-screen">
      <main className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Termos de Serviço
            </h1>
            <p className="text-sm text-default">
              Última atualização: Dezembro de 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Ao acessar e usar o site da BALM, você concorda em cumprir e estar sujeito aos seguintes 
                termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
                não deverá usar nosso site ou serviços.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                2. Cadastro e Conta de Usuário
              </h2>
              <p className="text-foreground leading-relaxed mb-3">
                Para realizar compras em nossa loja, é necessário criar uma conta de usuário. 
                Ao se cadastrar, você concorda em:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a confidencialidade de sua senha</li>
                <li>Ser responsável por todas as atividades que ocorram em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                3. Produtos e Preços
              </h2>
              <p className="text-foreground leading-relaxed mb-3">
                A BALM reserva-se o direito de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Modificar preços dos produtos a qualquer momento sem aviso prévio</li>
                <li>Limitar quantidades de produtos disponíveis para compra</li>
                <li>Descontinuar produtos sem aviso prévio</li>
                <li>Recusar ou cancelar pedidos por qualquer motivo</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-3">
                Fazemos todos os esforços para exibir informações precisas sobre produtos, 
                mas não garantimos que as descrições, imagens ou outros conteúdos sejam 
                precisos, completos ou livres de erros.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                4. Pedidos e Pagamentos
              </h2>
              <p className="text-foreground leading-relaxed mb-3">
                Ao fazer um pedido, você declara que:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>É maior de 18 anos ou tem permissão de um responsável legal</li>
                <li>As informações fornecidas são verdadeiras e completas</li>
                <li>Possui autorização para usar o método de pagamento fornecido</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-3">
                Todos os pagamentos são processados através do Mercado Pago. 
                A BALM não armazena informações de cartão de crédito ou dados bancários.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                5. Entrega
              </h2>
              <p className="text-foreground leading-relaxed">
                Os prazos de entrega são estimativas e podem variar conforme a região e disponibilidade 
                dos produtos. A BALM não se responsabiliza por atrasos causados pelos Correios ou 
                outras transportadoras. Em caso de extravio, trabalharemos para resolver a situação 
                o mais rápido possível.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                6. Política de Trocas e Devoluções
              </h2>
              <p className="text-foreground leading-relaxed mb-3">
                Conforme o Código de Defesa do Consumidor (Lei 8.078/90):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Você tem até 7 dias corridos após o recebimento para desistir da compra</li>
                <li>O produto deve estar em perfeito estado, sem sinais de uso</li>
                <li>A embalagem original deve estar intacta</li>
                <li>Produtos com defeito serão trocados ou o valor será reembolsado integralmente</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                7. Propriedade Intelectual
              </h2>
              <p className="text-foreground leading-relaxed">
                Todo o conteúdo do site, incluindo mas não limitado a textos, imagens, logotipos, 
                vídeos e código, é propriedade da BALM e está protegido por leis de direitos autorais. 
                É proibida a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                8. Privacidade e Proteção de Dados
              </h2>
              <p className="text-foreground leading-relaxed">
                A BALM está comprometida com a proteção de seus dados pessoais, em conformidade 
                com a Lei Geral de Proteção de Dados (LGPD). Coletamos apenas as informações 
                necessárias para processar seus pedidos e melhorar sua experiência. 
                Para mais detalhes, consulte nossa Política de Privacidade.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                9. Limitação de Responsabilidade
              </h2>
              <p className="text-foreground leading-relaxed">
                A BALM não se responsabiliza por danos indiretos, incidentais ou consequenciais 
                decorrentes do uso de nossos produtos ou serviços. Nossa responsabilidade máxima 
                é limitada ao valor pago pelo produto.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                10. Modificações dos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após sua publicação no site. 
                É sua responsabilidade revisar periodicamente estes termos.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                11. Lei Aplicável e Foro
              </h2>
              <p className="text-foreground leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa relacionada a estes termos será resolvida exclusivamente 
                no foro da comarca de Sapiranga, Rio Grande do Sul.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                12. Contato
              </h2>
              <p className="text-foreground leading-relaxed mb-3">
                Para dúvidas, reclamações ou sugestões sobre estes Termos de Serviço, 
                entre em contato conosco:
              </p>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-foreground"><strong>E-mail:</strong> contato@balm.com.br</p>
                <p className="text-foreground"><strong>Telefone:</strong> (51) 99999-9999</p>
                <p className="text-foreground"><strong>Endereço:</strong> Sapiranga, RS - Brasil</p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Ao continuar usando nosso site, você confirma que leu, compreendeu e 
                concordou com estes Termos de Serviço.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}