import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import SLTLookup from "./pages/SLTLookup";
import SLTImport from "./pages/SLTImport";
import PartsCoverage from "./pages/PartsCoverage";
import FactoryWarranty from "./pages/FactoryWarranty";
import OverlapChecker from "./pages/OverlapChecker";
import ScheduledMaintenance from "./pages/ScheduledMaintenance";
import CCCCodes from "./pages/CCCCodes";
import ClaimProcessor from "./pages/ClaimProcessor";
import ClaimLibrary from "./pages/ClaimLibrary";
import WarrantyConsultant from "./pages/WarrantyConsultant";
import QwenChat from "./pages/QwenChat";
import WeeklyReport from "./pages/WeeklyReport";
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
            <Route path="/slt/import" element={<SLTImport />} />
            <Route path="/parts" element={<PartsCoverage />} />
            <Route path="/factory-warranty" element={<FactoryWarranty />} />
            <Route path="/overlaps" element={<OverlapChecker />} />
            <Route path="/maintenance" element={<ScheduledMaintenance />} />
            <Route path="/ccc" element={<CCCCodes />} />
            <Route path="/cor" element={<ClaimProcessor />} />
            <Route path="/claim-library" element={<ClaimLibrary />} />
            <Route path="/consultant" element={<WarrantyConsultant />} />
            <Route path="/qwen" element={<QwenChat />} />
            <Route path="/report" element={<WeeklyReport />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
