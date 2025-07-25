/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
"use client";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { useGetWorkExperience } from "../api/use-work-experiences";

type TimelineEntry = NonNullable<ReturnType<typeof useGetWorkExperience>["data"]>;

export const Timeline = ({ data }: { data: TimelineEntry }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full"
      ref={containerRef}
    >

      <div ref={ref} className="relative  mx-auto pb-20">
        {data.map((item, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="flex justify-start pt-10 lg:pt-30 lg:gap-10 first:pt-10"
          >
            <div className="sticky flex flex-col lg:flex-row z-10 items-center top-40 self-start min-w-sm max-w-md lg:w-full">
              <div className="h-10 absolute w-10 rounded-full bg-secondary/80 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-primary border border-accent p-2" />
              </div>
              <h3 className="hidden lg:block text-xl lg:pl-16 lg:text-2xl  overflow-hidden text-ellipsis">
                <span className="text-secondary-foreground/80">{`${item.startDate}/${item.endDate}`}</span>
                <br />
                <span>
                  {item.company}
                  {" "}
                  ergergergegr
                </span>
                <br />
                <span>
                  {item.role}
                  {" "}
                  erferververvegrev er evbe
                </span>
              </h3>
            </div>

            <div className="relative pl-20 pr-4 lg:pl-4 w-full">
              <h4 className="lg:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
              </h4>

            </div>
          </div>
        ))}
        <div
          style={{
            height: `${height}px`,
          }}
          className="absolute lg:left-5 eft-5 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
