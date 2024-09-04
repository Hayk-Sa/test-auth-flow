import { Link, useSearch } from "@tanstack/react-router";
import TeacherSignUp from "@/components/sign-up/Teacher";
import DonorSignUp from "@/components/sign-up/Donor";

export default function SignUp() {
  const { role } = useSearch({
    from: "/sign-up",
    select(search) {
      return {
        role: search.role,
      };
    },
  });

  if (role === "teacher") {
    return <TeacherSignUp />;
  } else if (role === "donor") {
    return <DonorSignUp />;
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up as</h1>
          <div className="flex space-x-4">
            <Link
              to="/sign-up"
              search={{ role: "teacher" }}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Teacher
            </Link>
            <Link
              to="/sign-up"
              search={{ role: "donor" }}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Donor
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
