import { OrbitingCircles } from "./orbiting-circle";

const Icon = ({ src }: { src: string }) => (
  <img src={src} alt="" tabIndex={-1} className="duration-200 rounded-sm hover:scale-110" />
);

export default function Frameworks() {
  const skills = [
    "css3",
    "git",
    "github",
    "html5",
    "javascript",
    "react",
    "sqlite",
    "tailwindcss",
    "vitejs",
    "threejs",
    "visualstudiocode",
  ];
  return (
    <div className="relative flex h-[15rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/${skill}.svg`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {skills.reverse().map((skill, index) => (
          <Icon key={index} src={`assets/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}
