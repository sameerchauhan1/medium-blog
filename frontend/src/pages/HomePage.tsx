import { Link } from "react-router-dom";

const HomePage = () => {
   return (
      <div>
         <nav className="flex items-center justify-between bg-gray-900 px-4 py-3">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
               <img
                  className="h-8 w-auto"
                  src="https://miro.medium.com/v2/resize:fit:1200/1*jfdwtvU6V6g99q3G7gq7dQ.png"
                  alt="Logo"
               />
            </div>

            <div className="flex">
               <Link to="/signin">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                     Sign in
                  </button>
               </Link>
               <Link to="/signup">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                     Get started
                  </button>
               </Link>
            </div>
         </nav>
      </div>
   );
};

export default HomePage;
