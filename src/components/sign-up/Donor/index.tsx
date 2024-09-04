import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link } from "@tanstack/react-router";
import { MOCK_COUNTRIES, MOCK_REGIONS, MOCK_CITIES } from "@/utils/constants";
import { useForm } from "@tanstack/react-form";
import { Icon } from "@iconify/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { signUpDonor } from "@/api";
import { useNavigate } from "@tanstack/react-router";

export default function DonorSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "",
      region: "",
      city: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await signUpDonor(value);
        if (result.success) {
          navigate({
            to: result.redirectTo || "/verify-account",
            search: {
              email: value.email,
              role: result.role,
            },
          });
        } else {
          // Handle error (you might want to add a state for error messages)
          console.error(result.message);
        }
      } catch (error) {
        console.error("An error occurred during sign-up:", error);
      }
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-164px)] flex-col p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl h-full w-full max-w-md relative sm:border sm:border-gray-200 flex-1 flex flex-col">
        <h1 className="text-2xl text-center font-bold mb-2">
          {t("DONOR_SIGN_UP")}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {t("REGISTER_AS_DONOR")}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 flex flex-col space-y-4"
        >
          <div className="flex gap-2">
            <form.Field
              name="firstName"
              validators={{
                onChange: z
                  .string()
                  .min(3, "First name must be at least 3 characters"),
              }}
              children={(field) => (
                <Input
                  isInvalid={Boolean(
                    field.state.meta.isTouched && field.state.meta.errors.length
                  )}
                  errorMessage={field.state.meta.errors.join(",")}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onValueChange={(value) => field.handleChange(value)}
                  size="sm"
                  variant="bordered"
                  label={t("FIRST_NAME")}
                />
              )}
            />

            <form.Field
              name="lastName"
              validators={{
                onChange: z
                  .string()
                  .min(3, "Last name must be at least 3 characters"),
              }}
              children={(field) => (
                <Input
                  isInvalid={Boolean(
                    field.state.meta.isTouched && field.state.meta.errors.length
                  )}
                  errorMessage={field.state.meta.errors.join(",")}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onValueChange={(value) => field.handleChange(value)}
                  size="sm"
                  variant="bordered"
                  label={t("LAST_NAME")}
                />
              )}
            />
          </div>
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
          <div className="relative">
            <form.Field
              name="phoneNumber"
              validators={{
                onChange: z
                  .string()
                  .min(10, "Phone number must be at least 10 characters"),
              }}
              children={(field) => (
                <>
                  <PhoneInput
                    id={field.name}
                    name={field.name}
                    placeholder={t("PHONE_NUMBER")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value as string)}
                    className="w-full h-[40px] rounded-md border-2 border-gray-300 px-3 py-1 text-sm outline-none"
                    numberInputProps={{
                      className: "focus:outline-none",
                    }}
                  />
                  {Boolean(
                    field.state.meta.isTouched && field.state.meta.errors.length
                  ) ? (
                    <span className="text-xs text-danger">
                      {field.state.meta.errors.join(",")}
                    </span>
                  ) : null}
                </>
              )}
            />
            <label className="absolute text-xs text-gray-500 -top-2 left-2 bg-white px-1">
              {t("PHONE_NUMBER")}
            </label>
          </div>
          <form.Field
            name="country"
            validators={{
              onChange: z
                .string()
                .min(3, "Country must be at least 3 characters"),
            }}
            children={(field) => (
              <Select
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                id={field.name}
                name={field.name}
                size="sm"
                variant="bordered"
                label={t("COUNTRY")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              >
                {MOCK_COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <form.Field
            name="region"
            validators={{
              onChange: z
                .string()
                .min(3, "Region must be at least 3 characters"),
            }}
            children={(field) => (
              <Select
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                id={field.name}
                name={field.name}
                size="sm"
                variant="bordered"
                label={t("REGION_STATE")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              >
                {MOCK_REGIONS.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <form.Field
            name="city"
            validators={{
              onChange: z.string().min(3, "City must be at least 3 characters"),
            }}
            children={(field) => (
              <Select
                isInvalid={Boolean(
                  field.state.meta.isTouched && field.state.meta.errors.length
                )}
                errorMessage={field.state.meta.errors.join(",")}
                size="sm"
                id={field.name}
                name={field.name}
                variant="bordered"
                label={t("CITY")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              >
                {MOCK_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <form.Field
            name="password"
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
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters").refine(v => v === form.getFieldValue("password"), "Passwords do not match"),
                onChangeListenTo: ["password"],
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
                required
                endContent={
                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                    className="focus:outline-none"
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
          <div className="flex justify-between mt-4">
            <Button
              as={Link}
              to="/sign-up"
              search={{ role: "teacher" }}
              variant="light"
              color="primary"
            >
              {t("REGISTER_AS_TEACHER")}
            </Button>
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
                  {t("REGISTER")}
                </Button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
