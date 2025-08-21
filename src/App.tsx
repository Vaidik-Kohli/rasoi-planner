import { useState } from "react";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIPlanner from "./components/AIPlanner";

const queryClient = new QueryClient();

// Simple home page component for testing
const Home = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Rasoi Planner</h1>
    <p className="mb-4">Welcome to Rasoi Planner. The AI meal planning feature is available at:</p>
    <a href="/ai-planner" className="text-blue-600 hover:underline font-medium">
      /ai-planner - AI Meal Planner
    </a>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
      <div className="min-h-screen bg-gray-50">
        {/* <Toaster /> */}
        {/* <Sonner /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
