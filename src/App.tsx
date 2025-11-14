import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Entradas from "./pages/Entradas";
import Saidas from "./pages/Saidas";
import Categorias from "./pages/Categorias";
import Cartoes from "./pages/Cartoes";
import NotFound from "./pages/NotFound";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Futuros from "./pages/Futuros";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SignedOut>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </SignedOut>
        <SignedIn>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#F5F7FA]">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-40 flex h-14 items-center border-b border-[#E5E7EB] bg-white/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                  <SidebarTrigger className="md:hidden" />
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/entradas" element={<Entradas />} />
                    <Route path="/saidas" element={<Saidas />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/futuros" element={<Futuros />} />
                    <Route path="/cartoes" element={<Cartoes />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </SignedIn>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
