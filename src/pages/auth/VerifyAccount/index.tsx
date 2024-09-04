import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { verifyAccount } from "@/api";
import { toast } from "sonner";

export default function VerifyAccount() {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const { email, role } = useSearch({
    from: "/verify-account",
    select(search) {
      return {
        email: search.email,
        role: search.role as "teacher" | "donor",
      };
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const result = await verifyAccount(email, role, verificationCode);
      if (result.success) {
        toast.success("Verification code submitted");
        navigate({ to: result.redirectTo || "/sign-in" });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-164px)] flex-col p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl h-full w-full max-w-md relative sm:border sm:border-gray-200 flex-1 flex flex-col">
        <h1 className="text-2xl text-center font-bold mb-2">
          {t("VERIFY_ACCOUNT")}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {t("ENTER_VERIFICATION_CODE")}
        </p>
        <div className="border-t border-gray-200 my-4" />
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <Input
            label={t("VERIFICATION_CODE")}
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="mb-4"
          />
          <div className="flex-1" />
          <Button
            type="submit"
            color="primary"
            fullWidth
            className="text-white font-bold mt-4"
          >
            {t("VERIFY")}
          </Button>
        </form>
      </div>
    </div>
  );
}
