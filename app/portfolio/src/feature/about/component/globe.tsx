import World from "./world";

// https://ui.aceternity.com/components/github-globe
export default function Globe() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 45.7349, lng: 9.2733 },

    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const milanLat = 45.4642;
  const milanLng = 9.19;
  const arcs = [
  // Osaka (Japan)
    {
      order: 1,
      startLat: milanLat,
      startLng: milanLng,
      endLat: 34.6937,
      endLng: 135.5023, // Osaka
      arcAlt: 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    // Sydney (Australia)
    {
      order: 2,
      startLat: milanLat,
      startLng: milanLng,
      endLat: -33.8688,
      endLng: 151.2093, // Sydney
      arcAlt: 0.22,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    // Berlin (Germany)
    {
      order: 3,
      startLat: milanLat,
      startLng: milanLng,
      endLat: 52.52,
      endLng: 13.405, // Berlin
      arcAlt: 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    // Atlanta (USA)
    {
      order: 4,
      startLat: milanLat,
      startLng: milanLng,
      endLat: 33.749,
      endLng: -84.388, // Atlanta
      arcAlt: 0.17,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    // Toronto (Canada)
    {
      order: 5,
      startLat: milanLat,
      startLng: milanLng,
      endLat: 43.6532,
      endLng: -79.3832, // Toronto
      arcAlt: 0.19,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  ];

  return (
    <figure className="absolute inset-0  translate-y-1/2 ">
      <World data={arcs} globeConfig={globeConfig} />
    </figure>
  );
}
