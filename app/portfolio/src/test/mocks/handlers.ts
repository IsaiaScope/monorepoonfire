/**
 * Mock Service Worker (MSW) Handlers
 *
 * This file defines mock API handlers for intercepting and responding to
 * HTTP requests during testing. Each handler defines how to respond to
 * specific API endpoints, allowing us to test components without relying
 * on an actual backend server.
 *
 * The handlers simulate the projects API with realistic responses,
 * including success scenarios, error cases, and edge conditions.
 */

import { APP_HONO } from "@app/hono/constant";
import { http, HttpResponse } from "msw";

import { env } from "../../environment/env";
import { mockProjectsData } from "./data/projects";
import { mockWorkExperiencesData } from "./data/work-experiences";

// API endpoint URL - matches the test environment API endpoint
// The API is served on the test environment with /api base path
const BASE_URL = `${env.VITE_BASE_URL}${APP_HONO.BASE_PATH}`;

/**
 * Mock handlers for the projects API
 *
 * These handlers intercept HTTP requests and provide mock responses.
 * The default handlers simulate successful API calls with realistic data.
 */
export const handlers = [
  /**
   * GET /api/projects - Successful response with project list
   *
   * This handler simulates a successful API call that returns an array
   * of projects. It's used as the default behavior for testing components
   * that load projects data on mount.
   */
  http.get(`${BASE_URL}${APP_HONO.ROUTES.PROJECTS}`, () => {
    return HttpResponse.json(mockProjectsData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  /**
   * GET /api/work-experience - Successful response with work experience list
   *
   * This handler simulates a successful API call that returns an array
   * of work experiences. It's used as the default behavior for testing components
   * that load work experience data on mount.
   */
  http.get(`${BASE_URL}${APP_HONO.ROUTES.WORK_EXPERIENCE}`, () => {
    return HttpResponse.json(mockWorkExperiencesData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

];
