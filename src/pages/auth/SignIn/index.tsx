import { type AnyRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useSearch } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { signIn } from "@/api";

interface SignInSearchParams extends AnyRoute {
  redirect?: string;
}

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch<SignInSearchParams>({ from: "/sign-in" });
  const { setIsAuthenticated } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await signIn(value.email, value.password);
        if (result.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", result.role || "");
          setIsAuthenticated(true);

          toast.success(result.message);
          const redirectTo = search.redirect || "/";
          navigate({ to: redirectTo });
        } else {
          toast.error(result.message);
          if (result.role) {
            if (result.verificationCode) {
              toast.info(
                `Please verify your account with the code ${result.verificationCode}`
              );
            }
            navigate({
              to: "/verify-account",
              search: {
                email: value.email,
                role: result.role,
              },
            });
          }
        }
      } catch (error) {
        console.error("An error occurred during sign-in:", error);
        toast.error("An error occurred during sign-in");
      }
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-164px)] flex-col p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl h-full w-full max-w-md relative sm:border sm:border-gray-200 flex-1">
        <h1 className="text-2xl text-center font-bold mb-2">{t("SIGN_IN")}</h1>
        <p className="text-gray-600 text-center mb-6">{t("WELCOME_BACK")}</p>
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }} className="space-y-4">
          <form.Field
            name="email"
            validators={{
              onChange: z.string().email("Invalid email address"),
            }}
            children={(field) => (
              <Input
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                variant="bordered"
                label={t("EMAIL")}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
              />
            )}
          />

          <form.Field
            name="password"
            validators={{
              onChange: z.string().min(1, "Password is required"),
            }}
            children={(field) => (
              <Input
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                variant="bordered"
                label={t("PASSWORD")}
                type={isPasswordVisible ? "text" : "password"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
                required
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    aria-label="toggle password visibility"
                  >
                    {isPasswordVisible ? (
                      <Icon
                        icon="tabler:eye-off"
                        className="w-6 h-6 text-gray-400"
                      />
                    ) : (
                      <Icon
                        icon="tabler:eye"
                        className="w-6 h-6 text-gray-400"
                      />
                    )}
                  </button>
                }
              />
            )}
          />
          <Link
            to="/forgot-password"
            className="block text-right mb-4 text-primary"
          >
            {t("FORGOT_PASSWORD")}
          </Link>
          <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  color="primary"
                  isDisabled={!canSubmit}
                  isLoading={isSubmitting}
                  className="text-white font-bold"
                >
                  {t("SIGN_IN")}
                </Button>
              )}
            />
        </form>
        <div className="absolute bottom-4 left-0 right-0 text-center p-4">
          <p className="mb-2">{t("REGISTER_AS_A")}</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() =>
                navigate({ to: "/sign-up", search: { role: "teacher" } })
              }
              variant="solid"
              color="default"
              fullWidth
            >
              {t("TEACHER")}
            </Button>
            <Button
              onClick={() =>
                navigate({ to: "/sign-up", search: { role: "donor" } })
              }
              variant="solid"
              color="default"
              fullWidth
            >
              {t("DONOR")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
