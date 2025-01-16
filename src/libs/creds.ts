import { getStoredPrivateKeyAndUserId } from "../utils/get-stored-private-key";

export const getCreds = async () => {
  const { userId, deviceId } = await getStoredPrivateKeyAndUserId();
  return {
    userId,
    deviceId,
  };
};
