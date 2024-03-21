import { redirect } from "react-router-dom";

export async function requireAuth(request) {
  const pathname = new URL(request.url).pathname;
  const user = getUserFromStorage();
  if (!user?.id) {
    throw redirect(
      `/login?message=You must log in first.&redirectTo=${pathname}`
    );
  }

  return user;
}

export function setUserToStorage(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromStorage() {
  const user = localStorage.getItem("user");
  if (user == "undefined") return null;
  return JSON.parse(user);
}

export function deleteUserFromStorage() {
  localStorage.removeItem("user");
}
