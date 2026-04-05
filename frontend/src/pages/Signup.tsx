import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"

export const Signup = () => {
  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-[35%_65%]">
      
      <div className="hidden lg:flex items-center justify-center bg-orange-100">
        <Quote />
      </div>

      <div className="flex items-center justify-center bg-taupe-600">
        <Auth type="signup" />
      </div>

    </div>
  );
};