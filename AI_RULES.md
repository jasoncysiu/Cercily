# AI Rules and Development Guidelines

This document outlines the core technologies used in this application and provides guidelines for their appropriate use.

## Tech Stack

*   **React:** The primary JavaScript library for building user interfaces.
*   **Next.js:** The React framework used for server-side rendering, routing, and API routes.
*   **TypeScript:** All code should be written in TypeScript for type safety and improved developer experience.
*   **Tailwind CSS:** The utility-first CSS framework for all styling.
*   **shadcn/ui:** A collection of reusable UI components built with Radix UI and Tailwind CSS.
*   **React Query (`@tanstack/react-query`):** For efficient data fetching, caching, and state management.
*   **Lucide React (`lucide-react`):** A library for open-source icons.
*   **Sonner (`sonner`):** For displaying elegant toast notifications.
*   **React Hook Form (`react-hook-form`) & Zod (`zod`):** For robust form management and validation.
*   **Notion API (`@notionhq/client`):** Used for persisting user sessions and analysis data.
*   **Google Generative AI (`@google/generative-ai`) & OpenRouter API:** For AI model interactions and problem analysis.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following rules when using libraries:

*   **React & Next.js:** These are the foundational technologies. Use React components for UI and Next.js features (like API routes, `next/link`, `next/image`) where appropriate.
*   **TypeScript:** Always use TypeScript. Ensure all new components, hooks, and utility functions are strongly typed.
*   **Tailwind CSS:** All styling must be done using Tailwind CSS utility classes. Avoid custom CSS files or inline styles unless absolutely necessary for dynamic properties not covered by Tailwind.
*   **shadcn/ui:**
    *   **Prioritize:** Always use components from `components/ui` (e.g., `Button`, `Card`, `Dialog`, `Select`) when a suitable one exists.
    *   **No Direct Modification:** Do NOT modify the files within `components/ui` directly. If a component needs customization beyond its props, create a new component that wraps or extends the `shadcn/ui` component.
*   **Radix UI:** `shadcn/ui` components are built on Radix UI primitives. You should generally use the `shadcn/ui` wrappers instead of importing and using Radix UI primitives directly, unless there's a very specific need not covered by `shadcn/ui`.
*   **React Query:** Use `useQuery` for fetching data and `useMutation` for data modifications (e.g., saving sessions, analyzing problems). This ensures proper caching, loading states, and error handling.
*   **Lucide React:** Use `lucide-react` for all icons in the application.
*   **Sonner:** Use the `toast` function from `sonner` for all user notifications (success, error, info).
*   **React Hook Form & Zod:** For any forms requiring input and validation, use `react-hook-form` for form state management and `zod` for schema validation.
*   **Notion API:** Interact with Notion only through the `services/notion-service.ts` file. Do not directly call Notion API endpoints from components or pages.
*   **AI Services:** Interact with AI models only through the `services/ai-service.ts` file and the `use-analyze-problem.ts` hook. Do not directly call AI APIs from components.