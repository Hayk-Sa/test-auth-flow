import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { resetPassword } from "@/api";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { email } = useSearch({
    from: "/reset-password",
    select(search) {
      return {
        email: search.email,
      };
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm({
    defaultValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      try {
        const result = await resetPassword(
          email,
          value.verificationCode,
          value.newPassword
        );
        if (result.success) {
          toast.success(result.message);
          navigate({ to: "/sign-in" });
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("An error occurred during password reset:", error);
        toast.error("An error occurred during password reset");
      }
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-164px)] flex-col p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl h-full w-full max-w-md relative sm:border sm:border-gray-200 flex-1 flex flex-col">
        <h1 className="text-2xl text-center font-bold mb-2">
          {t("RESET_PASSWORD")}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {t("ENTER_NEW_PASSWORD")}
        </p>
        <div className="border-t border-gray-200 my-4" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 flex flex-col space-y-4"
        >
          <form.Field
            name="verificationCode"
            validators={{
              onChange: z
                .string()
                .min(4, "Verification code must be at least 4 characters"),
            }}
            children={(field) => (
              <Input
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                variant="bordered"
                label={t("VERIFICATION_CODE")}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
              />
            )}
          />
          <form.Field
            name="newPassword"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters"),
            }}
            children={(field) => (
              <Input
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                variant="bordered"
                label={t("NEW_PASSWORD")}
                type={isPasswordVisible ? "text" : "password"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Icon
                      icon={isPasswordVisible ? "tabler:eye-off" : "tabler:eye"}
                      className="w-6 h-6 text-gray-400"
                    />
                  </button>
                }
              />
            )}
          />
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .refine(
                  (v) => v === form.getFieldValue("newPassword"),
                  "Passwords do not match"
                ),
              onChangeListenTo: ["newPassword"],
            }}
            children={(field) => (
              <Input
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                variant="bordered"
                label={t("CONFIRM_PASSWORD")}
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) => field.handleChange(value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    <Icon
                      icon={
                        isConfirmPasswordVisible
                          ? "tabler:eye-off"
                          : "tabler:eye"
                      }
                      className="w-6 h-6 text-gray-400"
                    />
                  </button>
                }
              />
            )}
          />
          <div className="flex-1" />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                color="primary"
                isDisabled={!canSubmit}
                isLoading={isSubmitting}
                className="text-white font-bold mt-4"
              >
                {t("RESET_PASSWORD")}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
