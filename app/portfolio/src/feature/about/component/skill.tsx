import { motion } from "motion/react";
import { useMemo, useState } from "react";

type Props = {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  total: number;
};

const Skill = ({ text, containerRef, index, total }: Props) => {
  const [imageExists, setImageExists] = useState(true);

  // Grid-based positioning with random offsets for organic distribution
  const randomStyle = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);

    const col = index % cols;
    const row = Math.floor(index / cols);

    const baseLeft = (col / (cols - 1 || 1)) * 60;
    const baseTop = (row / (rows - 1 || 1)) * 65;

    const randomOffsetX = (Math.random() - 0.5) * 12;
    const randomOffsetY = (Math.random() - 0.5) * 12;

    return {
      rotate: `${(Math.random() - 0.5) * 40}deg`,
      top: `${Math.max(0, Math.min(75, baseTop + randomOffsetY))}%`,
      left: `${Math.max(0, Math.min(75, baseLeft + randomOffsetX))}%`,
    };
  }, [index, total]);

  if (!containerRef || !containerRef.current)
    return null;

  return (
    <motion.div
      className="flex items-center justify-start absolute py-2 px-3 text-[#f3f4f6] bg-[#262626]/90 text-xl rounded-md cursor-grab m-2 ring-1 ring-[#f3f4f6] whitespace-nowrap min-w-max"
      style={randomStyle}
      whileHover={{ scale: 1.05 }}
      drag
      dragConstraints={containerRef}
      dragElastic={1}
    >
      {imageExists && (
        <img
          src={`assets/${text.toLowerCase().replaceAll(" ", "-")}.svg`}
          alt=""
          tabIndex={-1}
          className="duration-200 rounded-sm hover:scale-110 w-7 mr-2 pointer-events-none"
          loading="lazy"
          onError={() => setImageExists(false)}
        />
      )}
      {text}
    </motion.div>
  );
};

export default Skill;
