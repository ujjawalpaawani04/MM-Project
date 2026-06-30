import { Component } from "react";

/**
 * Catches errors thrown while loading/rendering a 3D model (e.g. a missing or
 * corrupt .glb) and renders the provided fallback instead of crashing the page.
 */
export default class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Surface model load/decode failures (e.g. Draco) in development so a silent
    // fallback to the static image is diagnosable; stay quiet in production.
    if (import.meta.env.DEV) {
      console.error("[3D model] failed to load - showing fallback:", error);
    }
  }

  componentDidUpdate(prevProps) {
    // Reset when the model source changes so a new product can try again.
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
