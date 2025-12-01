export default function SobrePage() {
  return (
    <div className="min-h-screen">
      <main className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sobre a BALM
            </h1>
            <p className="text-lg text-default">
              Do latim Balsamun, iluminando lares por todo o Brasil
            </p>
          </div>

          {/* Imagem Principal */}
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/foto.png"
              alt="BALM - Velas Artesanais"
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>

          {/* Nossa História */}
          <section className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Nossa História
            </h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Do latim <em>Balsamun</em>, surgiu a BALM, criada por mãe e filha em Sapiranga, 
                Rio Grande do Sul, e agora presente em todo o país.
              </p>
              <p>
                Com o objetivo de <strong>iluminar, esclarecer, ilustrar e ensinar</strong>, 
                desenvolvemos velas aromáticas que contêm o aroma mais potente e singular do mercado.
              </p>
              <p>
                Aqui, você mergulha em um mundo de fragrâncias naturais e beleza consciente. 
                Cada vela é cuidadosamente criada para proporcionar não apenas um aroma maravilhoso, 
                mas também uma experiência única.
              </p>
            </div>
          </section>

          {/* Nossos Valores */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  Qualidade
                </h3>
                <p className="text-foreground">
                  Ingredientes éticos e sustentáveis, sem comprometer a qualidade ou criatividade.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  Autenticidade
                </h3>
                <p className="text-foreground">
                  Aromas únicos e potentes, desenvolvidos com dedicação e expertise artesanal.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  Sustentabilidade
                </h3>
                <p className="text-foreground">
                  Compromisso com o meio ambiente em cada etapa da produção.
                </p>
              </div>
            </div>
          </section>

          {/* Produção Artesanal */}
          <section className="mb-12 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Produção Artesanal
            </h2>
            <p className="text-foreground leading-relaxed">
              Nossos produtos são feitos artesanalmente, com atenção a cada detalhe. 
              Do processo de criação das fragrâncias até o acabamento final, 
              cada vela BALM passa por rigoroso controle de qualidade.
            </p>
            <p className="text-foreground leading-relaxed">
              Utilizamos apenas ingredientes de alta qualidade, priorizando fornecedores 
              que compartilham nossos valores de sustentabilidade e responsabilidade social.
            </p>
          </section>

          {/* Call to Action */}
          <section className="bg-primary/10 p-8 rounded-lg text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Faça do seu lar completo com BALM!
            </h2>
            <p className="text-foreground mb-6">
              Descubra nossa coleção de velas aromáticas e transforme sua casa em um refúgio de bem-estar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/produtos" 
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-md transition-colors"
              >
                Ver Produtos
              </a>
              <a 
                href="/essencias" 
                className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3 rounded-md transition-colors"
              >
                Nossas Essências
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}