export default function Loading() {
  return (
    <div className="min-h-screen">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-muted-foreground text-sm font-medium">Carregando essências...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
