import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// Import pages
import {
  Teachers,
  Donors,
  Blog,
  ContactUs,
  AboutUs,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  VerifyAccount,
} from "@/pages";
import { Navbar } from "@/components";

import { authLoader } from "./auth";

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <Navbar />
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools />
    </AuthProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: async () => {
    throw redirect({
      to: "/teachers",
    });
  },
  component: () => null,
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers",
  component: Teachers,
  loader: authLoader,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutUs,
});

const donorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donors",
  component: Donors,
  loader: authLoader,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
  loader: authLoader,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactUs,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignIn,
  validateSearch: (
    search: Record<string, unknown>
  ): Record<string, unknown> => {
    return {
      redirect:
        typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUp,
  validateSearch: (
    search: Record<"role", "teacher" | "donor">
  ): Record<"role", "teacher" | "donor"> => {
    return {
      role: search.role,
    };
  },
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPassword,
  validateSearch: (
    search: Record<"email", string>
  ): Record<"email", string> => {
    return {
      email: search.email,
    };
  },
});

const verifyAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-account",
  component: VerifyAccount,
  validateSearch: (
    search: Record<"email" | "role", string>
  ): Record<"email" | "role", string> => {
    return {
      email: search.email,
      role: search.role,
    };
  },
});

// Routes List
const routes = [
  homeRoute,
  teachersRoute,
  aboutRoute,
  donorsRoute,
  blogRoute,
  contactRoute,
  signInRoute,
  signUpRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyAccountRoute,
];

const routeTree = rootRoute.addChildren(routes);

// Create the router
const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <RouterProvider
      router={router}
      context={{
        auth: AuthProvider,
      }}
    />
  );
}
