import honoClient from "../../../api/rpc";

export const getProjects = async () => {
  const res = await honoClient.api.projects.$get();
  return await res.json();
};
