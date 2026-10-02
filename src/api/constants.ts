const apiUrl = import.meta.env.VITE_GREEN_API_URL;
const idInstance = import.meta.env.VITE_GREEN_API_ID_INSTANCE;

// const url =
//   `${apiUrl}/waInstance${idInstance}` +
//   `/getStateInstance/${apiTokenInstance}`;

export const baseUrl = `${apiUrl}/waInstance${idInstance}`;
