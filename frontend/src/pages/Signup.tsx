import { Link } from "react-router-dom";
import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

const Signup = () => {
   return (
      <div>
         <Link to="/">
            <div>go back</div>
         </Link>
         <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
               <Auth type="signup" />
            </div>
            <div className="hidden lg:block">
               <Quote />
            </div>
         </div>
      </div>
   );
};

export default Signup;
