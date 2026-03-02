CREATE TABLE "curriculum" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar(500) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"language" varchar(50) NOT NULL,
	"subDescription" jsonb NOT NULL,
	"description" varchar(200) NOT NULL,
	"href" varchar(200) NOT NULL,
	"repo" varchar(200) NOT NULL,
	"image" varchar(200) NOT NULL,
	"title" varchar(100) NOT NULL,
	"tags" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "work-experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"language" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"company" varchar(100) NOT NULL,
	"location" varchar(100) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"shortDescription" varchar(500) NOT NULL,
	"startDate" varchar(50) NOT NULL,
	"endDate" varchar(50) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
