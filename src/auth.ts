import { redirect } from "@tanstack/react-router";

// This is a mock function. In a real app, you'd check if the user is actually authenticated.
export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

export async function authLoader() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    throw redirect({
      to: "/sign-in",
      search: {
        redirect: location.pathname + location.search,
      },
    });
  }
  return null;
}
