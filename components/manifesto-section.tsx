export function ManifestoSection() {
  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">Nossa História</h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p className="text-foreground">
                Do latim Balsamun, surgiu a BALM, criada por mãe e filha, em Sapiranga, RS e agora para todo o país.
              </p>
              <p className="text-foreground">
                Com o objetivo de iluminar, esclarecer, ilustrar e ensinar.
              </p>
              <p className="text-foreground">
                Através de velas aromáticas que contém o aroma mais potente e singular do mercado.
              </p>
              <p className="text-foreground">
                Aqui, mergulhe em um mundo de fragrâncias naturais e beleza consciente.
              </p>
              <p className="text-foreground">
                Cada vela é cuidadosamente criada para proporcionar não apenas um aroma maravilhoso, mas também uma experiência única.
              </p>
              <p className="text-foreground">
                Nossos produtos são feitos com ingredientes éticos e sustentáveis, sem comprometer a qualidade ou a criatividade.
              </p>
              <h3 className="text-foreground font-semibold text-base sm:text-lg">
                Faça do seu lar completo com BALM!
              </h3>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full">
            <img
              src="/foto.png"
              alt="Processo artesanal de criação das velas"
              className="w-full h-64 sm:h-96 md:h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
