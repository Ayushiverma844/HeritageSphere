import React, { useEffect, useState } from "react";
import Navbar from '../components/Navbar'
import placeService from "../services/placeService";
import collectionService from "../services/collectionService";
import Footer from "../components/Footer";
import {
   Search,
  Star,
  ChevronDown,
  Landmark,
  BadgeCheck,
  Castle,
  Building2,
  Trees,
  ScrollText,
  Mountain,
  TentTree,
  TreePine,
    Map as MapIcon,
  Church,
  Landmark as MosqueIcon,
  Library,
  Archive,
  SlidersHorizontal ,
    MapPin, 
    Bookmark
} from "lucide-react";
import { useLocation, useNavigate ,useSearchParams  } from "react-router-dom";


 const categoryIconMap = {
  Temple: Landmark,

  Mosque: MosqueIcon,

  Church: Church,

  Gurudwara: Landmark,

  Monastery: Library,

  Fort: Castle,

  Palace: Building2,

  Monument: Landmark,

  "Archaeological Site": Archive,

  Cave: Mountain,

  Museum: ScrollText,

  "Heritage Village": TentTree,

  "National Park": Trees,

  "Wildlife Sanctuary": TreePine,

  "Natural Attraction": MapIcon,
};

const Explore = () => {
   
 
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialSearch =
  searchParams.get("search") ||
  location.state?.search ||
  "";

  const [search, setSearch] = useState(initialSearch);
  
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [places, setPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
const [loading, setLoading] = useState(true);

const [selectedState, setSelectedState] = useState("");

const [sort, setSort] = useState("newest");

const [savedItems, setSavedItems] = useState([]);


const [selectedCategory, setSelectedCategory] = useState(
  location.state?.category || ""
);

const fetchPlaces = async () => {
  try {

    setLoading(true);

    const response = await placeService.getPlaces({

      search,

      category: selectedCategory || undefined,

      state: selectedState || undefined,

      sort,

      limit: 100

    });

   const fetchedPlaces = response.places || [];

setPlaces(fetchedPlaces);

// Store master list only once
if (allPlaces.length === 0) {
  setAllPlaces(fetchedPlaces);
}

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }
};


useEffect(() => {

  fetchPlaces();

}, [
  search,
  selectedCategory,
  selectedState,
  sort
]);

useEffect(() => {

  const stateSearch = location.state?.search;
  const stateCategory = location.state?.category;

  if (stateSearch !== undefined) {
    setSearch(stateSearch);
  }

  if (stateCategory !== undefined) {
    setSelectedCategory(stateCategory);
  }

}, [location]);


const categories = [

  {
    id: 0,
    name: "All",
    icon: BadgeCheck,
  },

  ...[
    ...new Map(
      allPlaces.map((p) => [
        p.category_name,
        {
          id: p.category_name,
          name: p.category_name,
          icon:
            categoryIconMap[p.category_name] ||
            Landmark,
        },
      ])
    ).values(),
  ],

];

  const handleSave = async (place) => {
  try {
    const isSaved = savedItems.includes(place.place_id);

    if (isSaved) {
      await collectionService.removeItem(
        "PLACE",
        place.place_id
      );

     setSavedItems((prev) =>
  prev.includes(place.place_id)
    ? prev.filter((id) => id !== place.place_id)
    : [...prev, place.place_id]
);
    } else {
      await collectionService.saveItem(
        "PLACE",
        place.place_id
      );

      setSavedItems((prev) => [
        ...prev,
        place.place_id,
      ]);
    }
  } catch (err) {
    console.log("Save error:", err);
  }
};

useEffect(() => {
  fetchSavedItems();
}, []);

const fetchSavedItems = async () => {
  try {
    const res = await collectionService.getMyCollection();

    const placeIds = (res.places || []).map(
      (p) => p.place_id
    );

    setSavedItems(placeIds);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <>
     <Navbar/>
     <div className="min-h-screen text-white pt-28">
      

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-5">

        <h1 className="text-5xl md:text-6xl font-bold">
          Explore India's{" "}
          <span className="text-heritage-gold">
            Heritage
          </span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-2xl">
          Discover timeless monuments, temples,
          forts and cultural wonders.
        </p>

        {/* Search */}
       <div className="mt-10 flex gap-4">

  {/* Search */}
  <div
    className="
    flex-1
    flex items-center gap-3
    px-5 py-4
    rounded-2xl
    bg-white/5
    border border-white/10
    focus-within:border-heritage-gold
    "
  >
    <Search size={20} />

   <input
type="text"
placeholder="Search heritage places..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-transparent outline-none w-full"
/>
  </div>

  {/* Filter Button */}
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="
    px-6
    rounded-2xl
    border
    border-heritage-gold/40
    bg-white/5
    flex
    items-center
    gap-2
    text-heritage-gold
    hover:bg-heritage-gold/10
    transition-all
    duration-300
    "
  >
    <SlidersHorizontal size={18} />
    Filters
  </button>

</div>
        {/* Categories */}

        <div className="mt-10">

  <div className="flex flex-wrap gap-5">

   {(showAllCategories
      ? categories
      : categories.slice(0,5)
).map((item)=>{

const Icon = item.icon;

const active =
selectedCategory === item.name ||
(item.name==="All" && selectedCategory==="");

return (
     <button
  key={item.id}
  onClick={() =>
    setSelectedCategory(
      item.name === "All"
        ? ""
        : item.name
    )
  }
  className="
  group
  flex
  flex-col
  items-center
  gap-2
  "
>
  <div
className={`
h-16
w-16
rounded-full
flex
items-center
justify-center
transition-all
duration-500

${
active
?
"bg-heritage-gold text-black border border-heritage-gold scale-110 shadow-[0_0_20px_rgba(212,175,55,.35)]"
:
"border border-heritage-gold/30 bg-white/5 text-heritage-gold group-hover:scale-110 group-hover:border-heritage-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:-translate-y-2"
}
`}
>        

<Icon size={24} />
           
          </div>

          <span className="text-sm text-gray-300">
            {item.name}
          </span>
        </button>
      );
    })}

    {/* View All */}
  <button
  onClick={() =>
    setShowAllCategories(!showAllCategories)
  }
  className="
    group
    flex
    flex-col
    items-center
    gap-2
    cursor-pointer
  "
>
  <div
    className={`
      h-16 w-16
      rounded-full
      border border-dashed border-heritage-gold/40
      bg-white/5
      flex items-center justify-center
      text-heritage-gold
      transition-all duration-500 ease-out
      group-hover:scale-110
      ${
        showAllCategories
          ? "rotate-180 scale-110 border-heritage-gold"
          : "rotate-0 scale-100"
      }
    `}
  >
    <span
      className={`
        text-2xl leading-none font-light
        transition-all duration-500 ease-out
        ${
          showAllCategories
            ? "rotate-180"
            : "rotate-0"
        }
      `}
    >
      {showAllCategories ? "-" : "+"}
    </span>
  </div>

  <span
    className="
      text-sm text-gray-300
      transition-all duration-300
      group-hover:text-white
    "
  >
    {showAllCategories
      ? "View Less"
      : "View All"}
  </span>
</button>

  </div>
  <div
  className={`
  overflow-hidden
  transition-all
  duration-500
  ${showFilters ? "max-h-75 mt-8" : "max-h-0"}
  `}
>
  <div
    className="
    p-6
    rounded-3xl
    bg-white/5
    border border-white/10
    backdrop-blur-xl
    "
  >

    <div className="grid md:grid-cols-2 gap-6">

      {/* State */}
      <div>

        <label className="block mb-3 text-gray-300">
          State
        </label>

       <select

value={selectedState}

onChange={(e)=>

setSelectedState(e.target.value)

}

className="
w-full
p-4
rounded-xl
bg-heritage-dark
border
border-white/10
outline-none
"

>

<option value="">

All States

</option>

{[
...new Set(

allPlaces.map(
p => p.state
)

)

]

.map((state)=>(

<option
key={state}
value={state}
>

{state}

</option>

))}

</select>

      </div>

      {/* Sort */}
      <div>

        <label className="block mb-3 text-gray-300">
          Sort By
        </label>

       <select

value={sort}

onChange={(e)=>

setSort(e.target.value)

}

className="
w-full
p-4
rounded-xl
bg-heritage-dark
border
border-white/10
outline-none
"

>

<option value="newest">

Newest

</option>

<option value="oldest">

Oldest

</option>

<option value="name">

Name A-Z

</option>

</select>

      </div>

    </div>

  </div>
</div>

</div>

      </div>

      {/* Gallery */}

      <div className="max-w-7xl mx-auto px-5 mt-16 pb-20">
        {loading && (

<div
className="
text-center
py-20
text-gray-400
text-lg
"
>

Loading Heritage Places...

</div>

)}

       {!loading && (

<div className="columns-1 sm:columns-2 lg:columns-3 gap-5">

          {places.length === 0 ? (

<div className=" text-center py-20 text-gray-400">

No Heritage Places Found.

</div>

) : (

places.map((place,index)=>(

 <div
  key={place.place_id}
  onClick={() =>
    navigate(

`/places/${place.place_id}`

)
  }
  className="
  relative
  mb-5
  overflow-hidden
  rounded-3xl
  break-inside-avoid
  cursor-pointer
  group
  "
>
    {/* Image */}
    <img
  src={
    place.image_url ||
    "/placeholder.jpg"
  }
  alt={place.name}
  className="
  w-full
  h-80
  object-cover
  transition-transform
  duration-700
  group-hover:scale-110
  "
/>

    {/* Gradient */}
    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

    {/* save Icon */}
    <div className="absolute top-4 right-4">
     <button
  onClick={(e) => {
    e.stopPropagation();
    handleSave(place);
  }}
  className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black transition cursor-pointer"
>
  <Bookmark
    size={18}
    className={
      savedItems.includes(place.place_id)
        ? "text-heritage-gold fill-heritage-gold"
        : "text-white"
    }
  />
</button>
    </div>

    {/* Bottom Content */}
    <div className="absolute bottom-5 left-5 right-5">

      {/* Category + Price */}
      <div className="flex items-center justify-between mb-2">

        <span className="text-xs px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">
          {place.category_name}
        </span>

        <span className="text-sm text-heritage-gold font-semibold">
          {place.entry_fee || "Free"}
        </span>

      </div>

      {/* Name */}
      <h3 className="text-2xl font-semibold">
        {place.name}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-2 mt-1 text-gray-300 text-sm">
        <MapPin size={14} />
        <span>{place.city} , {place.state}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-2">

        <Star
          size={16}
          fill="#d4af37"
          color="#d4af37"
        />

        <span>{place.average_rating || "N/A"}</span>
        

      </div>

    </div>
  </div>
))

)}
        </div>
       )}
      </div>

    </div>
     <Footer />
    </>
    
  );
};

export default Explore;