export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-muted-foreground text-sm font-medium">Carregando...</p>
      </div>
    </div>
  )
}