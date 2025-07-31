export const myProjects = [
  {
    id: 1,
    title: "Note Blog",
    description:
      "Facilitates purchases from international websites like Amazon and eBay, allowing customers to shop from these sites and have products delivered domestically.",
    subDescription: [
      "Built a scalable application with ASP.NET Core MVC, integrating global platforms like Amazon for domestic delivery.",
      "Implemented secure authentication and database management using ASP.NET Core Identity and Entity Framework Core.",
      "Designed a responsive frontend with Tailwind CSS, enhancing user experience.",
      "Added payment systems, localization, and product filtering for functionality improvements.",
    ],
    href: "https://garden-on-fire.vercel.app/",
    repo: "https://github.com/IsaiaScope/garden-on-fire",
    image: "/assets/garden-on-fire.png",
    tags: [
      {
        id: 1,
        name: "JavaScript",
        path: "/assets/logos/csharp.svg",
      },
      {
        id: 2,
        name: "Markdown",
        path: "/assets/logos/dotnet.svg",
      },
    ],
  },
  {
    id: 2,
    title: "Portfolio",
    description:
      "A secure authentication and authorization system using Auth0 for seamless user management.",
    subDescription: [
      "Integrated Auth0 for authentication, supporting OAuth, JWT, and multi-factor authentication.",
      "Implemented role-based access control (RBAC) for fine-grained user permissions.",
      "Developed a React-based frontend with Tailwind CSS for a sleek user experience.",
      "Connected to a secure SQLite database for user data storage.",
    ],
    href: "https://monorepoonfire.up.railway.app",
    repo: "https://github.com/IsaiaScope/monorepoonfire",
    image: "/assets/portfolio.png",
    tags: [
      {
        id: 1,
        name: "React",
        path: "/assets/logos/auth0.svg",
      },
      {
        id: 2,
        name: "SQLite",
        path: "/assets/logos/sqlite.svg",
      },
      {
        id: 3,
        name: "Hono",
        path: "/assets/logos/tailwindcss.svg",
      },
    ],
  },
];
