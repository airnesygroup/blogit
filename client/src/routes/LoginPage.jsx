import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div style={{ paddingTop: "100px",  }} className="flex items-center  px-3 md:px-9 justify-center h-[calc(100vh-80px)]">
      <SignIn signUpUrl="/register"/>
    </div>
  );
};

export default LoginPage;
