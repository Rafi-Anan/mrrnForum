export const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser || storedUser === "undefined" || storedUser === "null") {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    // Remove a value saved by an older/broken deployment so it cannot crash React.
    localStorage.removeItem("user");
    return null;
  }
};
