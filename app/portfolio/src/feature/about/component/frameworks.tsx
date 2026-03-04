/* eslint-disable react/no-array-index-key */
import { OrbitingCircles } from "./orbiting-circle";

const Icon = ({ src }: { src: string }) => (
  <img src={src} alt="" tabIndex={-1} className="duration-200 rounded-sm hover:scale-110" loading="lazy" />
);

export default function Frameworks() {
  const skills = [
    "react",
    "typescript",
    "nextjs-original",
    "angular",
    "nodejs",
    "tailwindcss",
    "aws",
    "vitejs",
    "git",
    "github",
    "claude-code",
    "copilot-orbit",
    "redux-orbit",
    "javascript",
  ];
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/${skill}.svg`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={1}>
        {skills.reverse().map((skill, index) => (
          <Icon key={index} src={`assets/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}
