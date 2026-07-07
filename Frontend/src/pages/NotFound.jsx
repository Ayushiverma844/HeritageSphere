import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  ArrowLeft,
  Landmark
} from "lucide-react";


const NotFound = () => {


return (

<div
className="
min-h-screen
flex
items-center
justify-center
px-6
"
>


<div
className="
text-center
max-w-xl
"
>


<div
className="
mx-auto
h-28
w-28
rounded-full
bg-heritage-gold/10
border
border-heritage-gold/30
flex
items-center
justify-center
"
>

<Compass

size={55}

className="
text-heritage-gold
"

/>

</div>




<h1
className="
text-8xl
font-bold
text-white
mt-8
"
>

404

</h1>



<h2
className="
text-3xl
font-semibold
text-white
mt-4
"
>

Lost in History?

</h2>




<p
className="
text-gray-400
mt-4
leading-7
"
>

The page you are looking for does not exist.
Maybe this heritage path has disappeared in time.

</p>





<div
className="
mt-8
flex
justify-center
"
>


<Link

to="/"

className="
flex
items-center
gap-2
px-6
py-3
rounded-2xl
bg-heritage-gold
text-black
font-semibold
hover:scale-105
transition
"

>


<ArrowLeft size={18}/>

Back To Home


</Link>


</div>





<div
className="
mt-12
flex
justify-center
items-center
gap-2
text-gray-500
"
>

<Landmark size={18}/>

HeritageSphere


</div>



</div>



</div>


);


};


export default NotFound;