import { memo } from "react";

import type { useGetProjects } from "../api/use-projects";

import Project from "./project";

type ProjectsListProps = {
  projects: NonNullable<ReturnType<typeof useGetProjects>["data"]>;
  setPreview: (preview: string | null) => void;
};

// Memoized component for the projects list to prevent re-renders
const ProjectsList = memo(({ projects, setPreview }: ProjectsListProps) => {
  return (
    <>
      {projects.map((project, index) => (
        <Project
          key={project.id}
          {...project}
          setPreview={setPreview}
          index={index}
        />
      ))}
    </>
  );
});

ProjectsList.displayName = "ProjectsList";

export default ProjectsList;
