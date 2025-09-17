import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Minha Conta</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e pedidos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <ProfileContent />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
