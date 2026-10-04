import type { GreenApiCredentials } from '../api/types';

export function getEnvCredentials(): GreenApiCredentials | null {
  const {
    VITE_GREEN_API_URL,
    VITE_GREEN_API_ID_INSTANCE,
    VITE_GREEN_API_TOKEN_INSTANCE,
  } = import.meta.env;

  if (
    !VITE_GREEN_API_URL ||
    !VITE_GREEN_API_ID_INSTANCE ||
    !VITE_GREEN_API_TOKEN_INSTANCE
  ) {
    return null;
  }

  return {
    apiUrl: VITE_GREEN_API_URL,
    idInstance: VITE_GREEN_API_ID_INSTANCE,
    apiTokenInstance: VITE_GREEN_API_TOKEN_INSTANCE,
  };
}
