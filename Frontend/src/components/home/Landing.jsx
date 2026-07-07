import {React , useState , useEffect} from "react";
import {
  Landmark,
  Castle,
  Building2,
  ScrollText,
  Trees,
  Church,
  Waves,
  Mountain,
  TentTree,
  TreePine,
  Shield,
  MapPinned,
  Pyramid,
  Cctv,
  Search,
  Ellipsis,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import categoryService from "../../services/categoryService";
import searchService from "../../services/searchService";
import img from "../../assests/bg2.jpg";


//  icons for category
const iconMap = {

  Temple: Landmark,

  Fort: Castle,

  Palace: Building2,

  Museum: ScrollText,

  Monument: Landmark,

  "Natural Attraction": Trees,

  Mosque: Church,

  Church: Church,

  Lake: Waves,

  River: Waves,

  Beach: Waves,

  Waterfall: Waves,

  Garden: TreePine,

  Park: TentTree,

  Cave: Mountain,

  Hill: Mountain,

  "Hill Station": Mountain,

  Memorial: Shield,

  Heritage: MapPinned,

  Tomb: Pyramid,

  Observatory: Cctv,

};
const Landing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

const [search, setSearch] = useState("");
useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    
    const data = await categoryService.getCategories({
  usage_type: "PLACE",
});

    setCategories(data.categories);
  } catch (err) {
    console.log(err);
  }
};

const handleSearch = async () => {

  if (!search.trim()) return;

  try {

    const res = await searchService.search(search);

    if (res.type === "PLACE") {

      navigate(
        `/places?search=${encodeURIComponent(search)}`
      );

    } else if (res.type === "STORY") {

      navigate(
        `/knowledge-hub?search=${encodeURIComponent(search)}`
      );

    } else {

      alert("No results found.");

    }

  } catch (err) {

    console.log(err);

  }

};
  return (
    <section className="relative min-h-[85vh] overflow-hidden rounded-b-3xl  ">

      {/* Background Image */}
      <img
  src={img}
  alt="Heritage"
  className="absolute inset-0 w-full h-full object-cover scale-x-[-1] "
/>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Blue Side Gradient */}
     <div className="absolute inset-0 bg-linear-to-r from-heritage-dark/90 via-heritage-dark/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-20">

        {/* Heading */}
        <div className="max-w-2xl">

          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-gray-100 leading-tight">
            Discover. Explore.
            <br />
            Preserve Our{" "}
            <span className="text-heritage-gold">
              Heritage
            </span>
          </h1>

          <p className="mt-5 text-gray-200 text-lg leading-relaxed">
            Explore the timeless beauty of India's cultural
            heritage, historic places and epic stories.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl hover:scale-105 transition-all ease-in-out">

<input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
  placeholder="Search for places..."
  className="w-full outline-none text-gray-700 bg-transparent"
/>

   <button onClick={handleSearch}>
                <Search
                  size={22}
                  className="text-gray-600"
                />
              </button>

            </div>
          </div>

          {/* Categories */}
          <div className="mt-10 flex flex-wrap gap-5">

           {categories.slice(0,5).map((item) => {

  const Icon =
  iconMap[item.category_name] || MapPinned;



              return (
                <button key={item.category_id}
                     onClick={() =>navigate("/places", {
                                state: {
                                category: item.category_name,},})}
                   className="group flex flex-col items-center gap-2">
                  <div
                    className="
                    h-16 w-16
                    rounded-full
                    border border-heritage-gold/40
                    bg-transparent
                    backdrop-blur-md
                    flex items-center justify-center
                    text-heritage-gold
                    transition-all duration-300
                    group-hover:scale-120
                    group-hover:border-heritage-gold
                    group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                    cursor-pointer
                  "
                  >
                    <Icon size={24} />
                  </div>

                  <span className="text-sm text-white">
                    {item.category_name}
                  </span>
                </button>
              );
            })}

            <button
  onClick={() => navigate("/places")}
  className="group flex flex-col items-center gap-2"
>
  <div
    className="
    h-16
    w-16
    rounded-full
    border
    border-heritage-gold/40
    flex
    items-center
    justify-center
    text-heritage-gold
    backdrop-blur-md
    transition-all
    duration-300
    group-hover:scale-110
    group-hover:border-heritage-gold
    "
  >
    <Ellipsis size={24} />
  </div>

  <span className="text-sm text-white">
    More
  </span>
</button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Landing;