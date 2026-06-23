import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Drives the camera distance from a `zoom` prop. We read the camera through
// R3F's imperative store getter (`get`) inside an effect rather than mutating
// the value returned directly by the hook - mutating the live Three.js camera
// is the intended R3F pattern, and going through `get()` keeps it compatible
// with React's immutability rules.
function CameraController({ zoom }) {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const camera = get().camera;
    camera.position.z = zoom;
    camera.updateProjectionMatrix();
  }, [get, zoom]);

  return null;
}

export default CameraController;
