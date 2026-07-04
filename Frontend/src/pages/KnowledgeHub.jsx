import React, { useState, useEffect } from "react";
import { Search ,ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import storyService from "../services/storyService";
import categoryService from "../services/categoryService";

const coverColors = [
  "bg-gradient-to-br from-red-500 to-red-800",
  "bg-gradient-to-br from-blue-500 to-blue-800",
  "bg-gradient-to-br from-green-500 to-green-800",
  "bg-gradient-to-br from-purple-500 to-purple-800",
  "bg-gradient-to-br from-amber-500 to-orange-800",
  "bg-gradient-to-br from-pink-500 to-rose-800",
  "bg-gradient-to-br from-cyan-500 to-blue-800",
  "bg-gradient-to-br from-indigo-500 to-violet-800",
  "bg-gradient-to-br from-emerald-500 to-green-800",
  "bg-gradient-to-br from-orange-500 to-red-800",
];

const KnowledgeHub = () => {

  const [stories, setStories] = useState([]);

const [categories, setCategories] = useState([]);

const [selectedCategory, setSelectedCategory] = useState("");

const [search, setSearch] = useState("");

const [loading, setLoading] = useState(false);

const [page, setPage] = useState(1);

const [pagination, setPagination] = useState({});



useEffect(() => {
  fetchCategories();
}, []);

useEffect(() => {
  fetchStories();
}, [page, selectedCategory, search]);


const fetchCategories = async () => {
  try {
    const data = await categoryService.getCategories({
      usage_type: "STORY",
    });

    setCategories(data.categories);
  } catch (err) {
    console.log(err);
  }
};

const fetchStories = async () => {
  try {
    setLoading(true);

    const data = await storyService.getStories({
      page,
      search,
      category: selectedCategory,
      limit: 12,
    });

    const storiesWithColor = data.stories.map((story, index) => ({
  ...story,
  coverColor: coverColors[index % coverColors.length],
}));

setStories(storiesWithColor);

    setPagination(data.pagination);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
 

  return (
    <div className="min-h-screen text-white pt-10 px-4 md:px-8">
         <Link
  to="/"
  className="
  inline-flex
  items-center
  gap-2
  mb-8
  px-4
  py-2
  rounded-xl
  bg-white/5
  border
  border-white/10
  text-gray-300
  hover:text-heritage-gold
  hover:border-heritage-gold
  transition-all
  duration-300
  "
>
  <ArrowLeft size={18} />
  Back to Home
</Link>
      {/* Heading */}

      <div className="max-w-7xl mx-auto">
        

        <h1 className="text-4xl md:text-5xl font-bold">
          Explore India's{" "}
          <span className="text-heritage-gold">
            Knowledge
          </span>
        </h1>

        <p className="text-gray-400 mt-4">
          Discover mythology, history, culture and untold stories.
        </p>

        {/* Search */}

        <div className="relative mt-8">

          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

         <input
type="text"
value={search}
onChange={(e)=>{

setSearch(e.target.value);

setPage(1);

}}
placeholder="Search stories..."
className="
w-full
py-4
pl-14
pr-5
rounded-2xl
bg-white/5
backdrop-blur-xl
border
border-white/10
outline-none
focus:border-heritage-gold
transition-all
"
/>
        </div>

        {/* Categories */}

        <div className="flex flex-wrap gap-3 mt-6">
          

        <button
onClick={()=>{
setSelectedCategory("");
setPage(1);
}}
className={`
px-4
py-2
rounded-full
transition-all

${
selectedCategory===""

? "bg-heritage-gold text-black"

: "bg-white/5 border border-white/10 hover:border-heritage-gold hover:text-heritage-gold"

}
`}
>
All
</button>

{categories.map((cat)=>(

<button

key={cat.category_id}

onClick={()=>{

setSelectedCategory(cat.category_name);

setPage(1);

}}

className={`
px-4
py-2
rounded-full
transition-all

${
selectedCategory===cat.category_name

? "bg-heritage-gold text-black"

: "bg-white/5 border border-white/10 hover:border-heritage-gold hover:text-heritage-gold"

}
`}
>

{cat.category_name}

</button>

))}

        </div>
      </div>


      {/* ================= BOOK SECTION ================= */}

      <div className="max-w-7xl mx-auto mt-16 pb-24">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-14 gap-y-16">

    {stories.map((story,index)=>(

      <Link
        key={story.id}
        to={`/stories/${story.story_id}`}
        className="group flex justify-center"
      >

       <div
className="
relative
z-0
w-75
h-120
transition-all
duration-500
ease-out
transform-gpu
transform-3d
perspective-[1500px]
group-hover:z-50
group-hover:-translate-y-5
group-hover:rotate-2
group-hover:scale-[1.02]
"
>
        

         {/* ================= BOOK COVER ================= */}

<div
 className="
absolute
inset-0
transition-all
duration-500
ease-out
group-hover:-translate-y-3
group-hover:scale-[1.02]
group-hover:rotate-1
"
>

  {/* Spine */}

  <div
className="
absolute
left-0
top-0
w-6
h-full
rounded-l-md
bg-linear-to-r
from-[#2b1b13]
to-[#6b4423]
"
>
    <div className="absolute right-0 top-0 h-full w-0.5 bg-yellow-700/40"></div>
  </div>

  {/* Cover */}

<div
className={`
absolute
left-4
top-0
bottom-5
rounded-r-md
border
overflow-hidden
origin-left
transition-all
duration-700
ease-out
group-hover:transform-[rotateY(-18deg)]
group-hover:shadow-[0_30px_60px_rgba(212,175,55,0.45)]
flex
flex-col
${story.coverColor}
`}
style={{
borderColor:"#b88935",
boxShadow:
"12px 12px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,215,120,.15)"
}}
>
     
    <div
className="
absolute
inset-0
opacity-0
group-hover:opacity-100
transition-opacity
duration-500
bg-linear-to-br
from-yellow-400/10
via-transparent
to-yellow-400/5
pointer-events-none
"
/>

    {/* Decorative Corners */}

    <div className="absolute left-3 top-3  text-yellow-600 text-xl">❦</div>
    <div className="absolute right-3 top-3 text-yellow-600 text-xl rotate-90">❦</div>
    <div className="absolute left-3 bottom-3 text-yellow-600 text-xl -rotate-90">❦</div>
    <div className="absolute right-3 bottom-3 text-yellow-600 text-xl rotate-180">❦</div>

    {/* Golden Border */}

    <div
className="
absolute
inset-3
rounded
border
border-yellow-700/60
transition-all
duration-500
group-hover:border-yellow-300
group-hover:shadow-[0_0_22px_rgba(255,215,0,0.7)]
"
/>

    {/* Image */}

    <div className="flex justify-center pt-10">

      <div
        className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-[3px]
        border-yellow-700 shadow-xl"
      >
        <img
          src={story.image}
          alt={story.title}
          className="
w-full
h-full
object-cover
object-center
transition-all
duration-700
group-hover:scale-110
group-hover:rotate-2
brightness-95
group-hover:brightness-110
"
        />
      </div>

    </div>

    {/* Category */}

    <div className="flex justify-center mt-4">

      <span
       className="
px-4
py-1
rounded-full
text-[11px]
tracking-widest
uppercase
border
border-yellow-700
text-yellow-500
transition-all
duration-500
group-hover:bg-yellow-500
group-hover:text-black
"
      >
        {story.category_name}
      </span>

    </div>

    {/* Title */}

<div className="px-5 mt-6 min-h-18.75 flex items-center justify-center">
  <h2
    className="
    text-center
    font-bold
    text-yellow-100
    leading-tight
    line-clamp-2
    transition-all
    duration-500
    group-hover:text-yellow-50
    "
    style={{
      fontFamily: "Cormorant Garamond, serif",
      fontSize:
        story.title.length > 22
          ? "1.55rem"
          : story.title.length > 12
          ? "1.75rem"
          : "2rem",
    }}
  >
    {story.title}
  </h2>
</div>

    {/* Description */}

  <div className="px-7 flex-1">
  <p
    className="
    text-center
    text-gray-300
    group-hover:text-white
    transition-colors
    duration-500
    text-[17px]
    leading-7
    line-clamp-3
    "
    style={{
      fontFamily: "Cormorant Garamond, serif",
    }}
  >
    {story.summary}
  </p>
</div>

    {/* Ornament */}

    <div className="flex justify-center mt-auto mb-6">

      <div className="w-12 h-0.5 bg-yellow-700"></div>

      <div className="mx-2 text-yellow-700 transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 ">
    ✦
</div>

      <div className="w-12 h-0.5 bg-yellow-700"></div>

    </div>

     <div
className="
absolute
top-0
left-[-120%]
w-1/2
h-full
bg-linear-to-r
from-transparent
via-white/25
to-transparent
skew-x-[-20deg]
transition-all
duration-1000
group-hover:left-[140%]
pointer-events-none
"
/>
  </div>

  {/* Pages */}
  <div
className="
absolute
bottom-0
left-1/2
-translate-x-1/2
w-52
h-10
rounded-full
bg-yellow-400/20
blur-2xl
opacity-0
transition-all
duration-500
group-hover:opacity-100
group-hover:scale-125
"
/>

  <div
    className="absolute bottom-0 left-4 right-0 h-5 rounded-b-md"
    style={{
      background:
        "linear-gradient(to bottom,#e8d9b6,#c8b18a)",
    }}
  ></div>

  <div
    className="absolute bottom-4 left-4 right-0 h-2"
    style={{
      background:
        "linear-gradient(to bottom,#f7ecd5,#d7c19a)",
    }}
  ></div>

 

</div>

        </div>

      </Link>

    ))}

  </div>


</div>


    </div>
  );
};

export default KnowledgeHub;