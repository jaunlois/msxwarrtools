import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import SLTLookup from "./pages/SLTLookup";
import PartsCoverage from "./pages/PartsCoverage";
import OverlapChecker from "./pages/OverlapChecker";
import ScheduledMaintenance from "./pages/ScheduledMaintenance";
import CCCCodes from "./pages/CCCCodes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/slt" element={<SLTLookup />} />
            <Route path="/parts" element={<PartsCoverage />} />
            <Route path="/overlaps" element={<OverlapChecker />} />
            <Route path="/maintenance" element={<ScheduledMaintenance />} />
            <Route path="/ccc" element={<CCCCodes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
