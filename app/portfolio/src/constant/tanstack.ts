import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// const queryClient = new QueryClient({
//   queryCache: new QueryCache({
//     onError: (error: Error | AxiosError) => {
//       console.error(`[QueryClient Error]`, error);
//       if (axios.isAxiosError<GenericErrorResponse>(error)) {
//         // https://www.radix-ui.com/primitives/docs/components/toast#api-reference
//         OnFire.toast({
//           title: `Error code: ${error.response?.data?.error?.code || error?.code}`,
//           description: error.response?.data?.error?.message || error.message,
//           variant: "destructive",
//         });
//       } else {
//         OnFire.toast({
//           title: "An error occurred",
//           description: error.message,
//           variant: "destructive",
//         });
//       }
//     },
//   }),
//   mutationCache: new MutationCache({
//     onError: (error: Error | AxiosError) => {
//       console.error(`[MutationCache Error]`, error);
//       OnFire.toast({
//         title: "An error occurred",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   }),
// });

export const TANSTACK = {
  QUERY_CLIENT: queryClient,
  QUERY_KEY: {
    GET_SKILLS: "get-skills",
    GET_WORK_EXPERIENCES: "get-work-experiences",
    GET_PROJECTS: "get-projects",
    SEND_EMAIL: "send-email",
  },
};
