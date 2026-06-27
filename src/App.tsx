import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { LandingPage } from "./pages/LandingPage";
import { LearnPage } from "./pages/LearnPage";
import { FortyTwoPage } from "./pages/FortyTwoPage";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:algorithmId" element={<LearnPage />} />
          <Route path="/42" element={<FortyTwoPage />} />
          <Route path="/42/:algorithmId" element={<FortyTwoPage />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
