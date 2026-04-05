import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"

//not- dynamic
// export const Signin = () => {
//     return <div>
//         <div className="grid grid-cols-[35%_65%] lg:grid-cols-[35%_65%] bg-lime-50" >
//             <div className="hidden lg:block">
//                 <Quote />
//             </div>
//             <div >
//                 <Auth type="signin"/>
//             </div>
//         </div>
//     </div>
// }

//dynamic
export const Signin = () => {
  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-[35%_65%] animate-fade-down">
      
      <div className="hidden lg:flex items-center justify-center bg-orange-100">
        <Quote />
      </div>

      <div className="flex items-center justify-center bg-taupe-600">
        <Auth type="signin" />
      </div>

    </div>
  );
};