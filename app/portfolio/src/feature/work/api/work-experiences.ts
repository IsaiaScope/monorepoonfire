import honoClient from "../../../api/rpc";

export const getWorkExperience = async () => {
  const res = await honoClient.api["work-experience"].$get();
  return await res.json();
};
