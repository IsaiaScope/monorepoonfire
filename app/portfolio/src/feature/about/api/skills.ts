import honoClient from "../../../api/rpc";

export const getSkills = async () => {
  const res = await honoClient.api.skills.$get();
  return await res.json();
};
