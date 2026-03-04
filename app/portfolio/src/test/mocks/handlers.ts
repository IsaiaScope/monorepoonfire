import { APP_HONO } from "@app/hono/constant";
import { http, HttpResponse } from "msw";

import { env } from "../../environment/env";
import { mockCurriculumData } from "./data/curriculum";
import { mockProjectsData } from "./data/projects";
import { mockSkillsData } from "./data/skills";
import { mockWorkExperiencesData } from "./data/work-experiences";

const BASE_URL = `${env.VITE_BASE_URL}${APP_HONO.BASE_PATH}`;

export const handlers = [
  http.get(`${BASE_URL}${APP_HONO.ROUTES.PROJECTS}`, () => {
    return HttpResponse.json(mockProjectsData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(`${BASE_URL}${APP_HONO.ROUTES.WORK_EXPERIENCE}`, () => {
    return HttpResponse.json(mockWorkExperiencesData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(`${BASE_URL}${APP_HONO.ROUTES.SKILLS}`, () => {
    return HttpResponse.json(mockSkillsData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get(`${BASE_URL}${APP_HONO.ROUTES.CURRICULUM}`, () => {
    return HttpResponse.json(mockCurriculumData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

];
