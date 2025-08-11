import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export default function PixiCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    (async () => {
      // Initialize Pixi Application
      app = await Application.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
        antialias: true
      });

      // Append Pixi canvas to the container
      containerRef.current.appendChild(app.canvas);

      // Create a rectangle
      const graphics = new Graphics();
      graphics.beginFill(0xde3249);
      graphics.drawRect(50, 50, 200, 100);
      graphics.endFill();

      app.stage.addChild(graphics);
    })();

    // Cleanup on unmount
    return () => {
      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
}
