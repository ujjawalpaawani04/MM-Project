import "./App.css";
import { MotionConfig } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    // `reducedMotion="user"` makes every framer-motion component honor the OS
    // "reduce motion" setting automatically (skips transform/layout animation,
    // keeps gentle opacity) - accessibility without touching each call site.
    <MotionConfig reducedMotion="user">
      <AppRoutes />
    </MotionConfig>
  );
}

export default App;
