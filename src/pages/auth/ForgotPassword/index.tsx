import { useTranslation } from "react-i18next";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { requestPasswordReset } from "@/api";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await requestPasswordReset(value.email);
        if (result.success) {
          toast.success(result.message, {
            duration: 10000,
            closeButton: true,
          });
          navigate({
            to: "/reset-password",
            search: {
              email: value.email,
            },
          });
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error(
          "An error occurred during password reset request:",
          error
        );
        toast.error("An error occurred during password reset request");
      }
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-164px)] flex-col p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl h-full w-full max-w-md relative sm:border sm:border-gray-200 flex-1 flex flex-col">
        <h1 className="text-2xl text-center font-bold mb-2">
          {t("RECOVER_PASSWORD")}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {t("ENTER_EMAIL_FOR_RECOVERY")}
        </p>
        <div className="border-t border-gray-200 my-4" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 flex flex-col"
        >
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
                className="mb-4"
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
                {t("SEND")}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
