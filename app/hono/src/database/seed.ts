/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/postgres-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

import { env } from "../environment/env";
import { curriculum } from "./schema/curriculum-schema";
import { projects } from "./schema/projects-schema";
import { skills } from "./schema/skills-schema";
import { workExperiences } from "./schema/work-experience-schema";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client);

function readJSON<T>(filename: string): T {
  const filepath = resolve(import.meta.dirname!, "json", filename);
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

type SkillRow = { id: number; name: string; createdAt: string; updatedAt: string };
type ProjectRow = { id: number; language: string; subDescription: string; description: string; href: string; repo: string; image: string; title: string; tags: string; createdAt: string; updatedAt: string };
type WorkExperienceRow = { id: number; language: string; name: string; company: string; location: string; description: string; shortDescription: string; startDate: string; endDate: string; createdAt: string; updatedAt: string };
type CurriculumRow = { id: number; url: string };

async function seed() {
  const skillsData = readJSON<SkillRow[]>("skills.json");
  const projectsData = readJSON<ProjectRow[]>("projects.json");
  const workExperienceData = readJSON<WorkExperienceRow[]>("work-experience.json");
  const curriculumData = readJSON<CurriculumRow[]>("curriculum.json");

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(projects);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(skills);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(workExperiences);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(curriculum);

  await db.insert(skills).values(
    skillsData.map(s => ({ name: s.name })),
  );

  await db.insert(projects).values(
    projectsData.map(p => ({
      language: p.language,
      title: p.title,
      description: p.description,
      subDescription: JSON.parse(p.subDescription) as string[],
      href: p.href,
      repo: p.repo,
      image: p.image,
      tags: JSON.parse(p.tags) as { id: number; name: string }[],
    })),
  );

  await db.insert(workExperiences).values(
    workExperienceData.map(w => ({
      language: w.language,
      role: w.name,
      company: w.company,
      location: w.location,
      longDescription: w.description,
      shortDescription: w.shortDescription,
      startDate: w.startDate,
      endDate: w.endDate,
    })),
  );

  await db.insert(curriculum).values(
    curriculumData.map(c => ({ url: c.url })),
  );

  await client.end();
  console.log("Seeded successfully");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
