import honoClient from "../../../api/rpc";

export const getCurriculum = async () => {
  const res = await honoClient.api.curriculum.$get();
  return await res.json();
};
