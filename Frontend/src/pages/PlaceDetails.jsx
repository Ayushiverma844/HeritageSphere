import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MapPin,
  Star,
  BookOpen,
  Landmark,
  Clock3,
  Ticket,
  ChevronRight,
  ArrowLeft,
  Bookmark,
} from "lucide-react";

import heroImg from "../assests/1.jpg";
import placeService from "../services/placeService";
import reviewService from "../services/reviewService";
import collectionService from "../services/collectionService";
import stories from "../pages/Story"

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
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
const handleSave = async () => {
  try {
    const isSaved = savedItems.includes(place.place_id);

    if (isSaved) {
      await collectionService.removeItem(
        "PLACE",
        place.place_id
      );

      setSavedItems((prev) =>
        prev.filter((id) => id !== place.place_id)
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


  // -----------------------------
  // Active Tab
  // -----------------------------
  const [activeTab, setActiveTab] = useState("About");

  const tabs = [
    "About",
    "Gallery",
    "Reviews",
    "Nearby",
  ];

  // -----------------------------
  // States
  // -----------------------------
  const [loading, setLoading] = useState(true);

  const [place, setPlace] = useState(null);

  const [details, setDetails] = useState({});

  const [gallery, setGallery] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [nearby, setNearby] = useState([]);

  const [rating, setRating] = useState({});

  const [similarPlaces, setSimilarPlaces] =
    useState([]);

  // New
  // Backend will return story if available
  const [story, setStory] = useState(null);

  // Logged in user's review
const [myReview, setMyReview] = useState(null);

const [reviewForm, setReviewForm] = useState({
  rating: 5,
  comment: "",
});

const [submittingReview, setSubmittingReview] =
  useState(false);

  // -----------------------------
  // Fetch Place Details
  // -----------------------------
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);

        const response =
          await placeService.getPlaceDetails(id);

        setPlace(response.place);

        setDetails(response.details || {});

        setGallery(response.gallery || []);

        setReviews(response.reviews || []);

        setNearby(response.nearby || []);

        setRating(response.rating || {});

        // null if no story exists
       setStory(response.story || null);

setMyReview(response.myReview || null);

if (response.myReview) {
  setReviewForm({
    rating: response.myReview.rating,
    comment: response.myReview.comment || "",
  });
}

        // Similar Places
        const similar =
          await placeService.getSimilarPlaces(id);

        setSimilarPlaces(
          similar.similarPlaces || []
        );

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  // -----------------------------
  // Loading Screen
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading Heritage Place...
      </div>
    );
  }

  const refreshPlace = async () => {
  const response =
    await placeService.getPlaceDetails(id);

  setPlace(response.place);
  setDetails(response.details || {});
  setGallery(response.gallery || []);
  setReviews(response.reviews || []);
  setNearby(response.nearby || []);
  setRating(response.rating || {});
  setStory(response.story || null);
  setMyReview(response.myReview || null);

  if (response.myReview) {
    setReviewForm({
      rating: response.myReview.rating,
      comment: response.myReview.comment || "",
    });
  } else {
    setReviewForm({
      rating: 5,
      comment: "",
    });
  }
};

const handleSubmitReview = async () => {

  try {

    setSubmittingReview(true);

    if (myReview) {

      await reviewService.updateReview(
        myReview.review_id,
        reviewForm
      );

    } else {

      await reviewService.addReview({
        place_id: id,
        ...reviewForm,
      });

    }

    await refreshPlace();

  } catch (err) {

    console.log(err);

  } finally {

    setSubmittingReview(false);

  }

};

const handleDeleteReview = async () => {

  if (!window.confirm("Delete Review?"))
    return;

  try {

    await reviewService.deleteReview(
      myReview.review_id
    );

    await refreshPlace();

  } catch (err) {

    console.log(err);

  }

};

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Place Not Found
      </div>
    );
  }
  return (
  <div className="min-h-screen text-white">

    {/* ================= Hero ================= */}

    <section className="relative h-125 overflow-hidden">

      <img
        src={place.image_url || heroImg}
        alt={place.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <Link
        to="/places"
        className="
        absolute
        top-8
        left-6
        md:left-20
        z-20
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        backdrop-blur-md
        bg-black/10
        text-white
        hover:text-heritage-gold
        hover:border-heritage-gold
        transition-all
        duration-300
        "
      >
        <ArrowLeft size={18} />
        Back to Explore
      </Link>

      <div className="absolute bottom-10 left-0 right-0 px-6 md:px-20">

        <span className="px-3 py-1 text-xs rounded-full bg-heritage-gold text-black font-semibold">
          {place.category_name}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold mt-4">
          {place.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-300">

          <div className="flex items-center gap-2">
            <MapPin size={18} />
            {place.city}, {place.state}
          </div>

          <div className="flex items-center gap-2 text-yellow-400">
            <Star
              size={18}
              fill="currentColor"
            />
            {rating.averageRating || "N/A"}
            <span className="text-sm text-gray-400">
              ({rating.totalReviews || 0} Reviews)
            </span>
          </div>

        </div>

      </div>

    </section>

    {/* ================= Content ================= */}

    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

      {/* Tabs */}

      <div className="flex flex-wrap gap-3 border-b border-heritage-gold/20 pb-4">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg transition ${
              activeTab === tab
                ? "bg-heritage-gold text-black"
                : "bg-white/5 border border-heritage-gold/20"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* Main Grid */}

      <div className="grid lg:grid-cols-3 gap-8 mt-8">

        {/* ================= Left ================= */}

        <div className="lg:col-span-2">

          {/* ABOUT TAB */}

          {activeTab === "About" && (

            <>

              <h2 className="text-2xl font-bold mb-4">
                About {place.name}
              </h2>

              <p className="text-gray-300 leading-8">
                {details.short_description ||
                  "No description available."}
              </p>

              {/* Info Cards */}

              <div className="grid md:grid-cols-2 gap-5 mt-8">

                <div
                  className="
                  bg-white/5
                  backdrop-blur-md
                  border
                  border-heritage-gold/20
                  rounded-2xl
                  p-5
                  "
                >

                  <p className="text-sm text-gray-400 mb-2">
                    ARCHITECTURE
                  </p>

                  <h3 className="font-semibold text-heritage-gold">
                    {details.architecture || "Not Available"}
                  </h3>

                </div>

                <div
                  className="
                  bg-white/5
                  backdrop-blur-md
                  border
                  border-heritage-gold/20
                  rounded-2xl
                  p-5
                  "
                >

                  <p className="text-sm text-gray-400 mb-2">
                    SIGNIFICANCE
                  </p>

                  <h3 className="font-semibold text-heritage-gold">
                    {details.significance || "Not Available"}
                  </h3>

                </div>

              </div>
                            {/* Why Famous */}

              {details?.why_famous && (

                <div className="mt-10">

                  <h2 className="text-2xl font-bold mb-4">
                    Why is it Famous?
                  </h2>

                  <p className="text-gray-300 leading-8">
                    {details.why_famous}
                  </p>

                </div>

              )}

              {/* History */}

              {details?.history && (

                <div className="mt-10">

                  <h2 className="text-2xl font-bold mb-4">
                    History
                  </h2>

                  <p className="text-gray-300 leading-8 whitespace-pre-line">
                    {details.history}
                  </p>

                </div>

              )}

              {/* Rituals */}

{details.rituals && (

<div className="mt-10">

<h2 className="text-2xl font-bold mb-4">
Rituals & Traditions
</h2>

<p className="text-gray-300 leading-8 whitespace-pre-line">
{details.rituals}
</p>

</div>

)}

{/* Travel Tips */}

{details.travel_tips && (

<div className="mt-10">

<h2 className="text-2xl font-bold mb-4">
Travel Tips
</h2>

<p className="text-gray-300 leading-8 whitespace-pre-line">
{details.travel_tips}
</p>

</div>

)}

{/* How To Reach */}

{details.how_to_reach && (

<div className="mt-10">

<h2 className="text-2xl font-bold mb-4">
How To Reach
</h2>

<p className="text-gray-300 leading-8 whitespace-pre-line">
{details.how_to_reach}
</p>

</div>

)}

              {/* Read Full Story */}

              {story && (

                <div
                  className="
                  mt-10
                  rounded-3xl
                  border
                  border-heritage-gold/20
                  bg-white/5
                  backdrop-blur-md
                  p-7
                  "
                >

                  <div className="flex items-center gap-3">

                    <BookOpen
                      className="text-heritage-gold"
                      size={30}
                    />

                    <div>

                      <h3 className="text-xl font-semibold">
                        Read the Complete Story
                      </h3>

                      <p className="text-gray-400 mt-1">
                        Explore the mythology,
                        legends and historical journey
                        behind {place.name}.
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/stories/${story.slug}`)
                    }
                    className="
                    mt-6
                    px-6
                    py-3
                    rounded-xl
                    bg-heritage-gold
                    text-black
                    font-semibold
                    hover:scale-105
                    transition
                    "
                  >
                    Read Full Story
                  </button>

                </div>

              )}

              {/* Similar Places */}

              <div className="mt-14">

                <div className="flex justify-between items-center mb-5">

                  <h2 className="text-2xl font-bold">
                    Similar Places
                  </h2>

                  <button
                    onClick={() => navigate("/places")}
                    className="text-heritage-gold flex items-center gap-1"
                  >
                    View All
                    <ChevronRight size={16} />
                  </button>

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                  {similarPlaces.length === 0 ? (

                    <p className="text-gray-400">
                      No Similar Places Found.
                    </p>

                  ) : (

                    similarPlaces.map((item) => (

                      <div
                        key={item.place_id}
                        onClick={() =>
                          navigate(`/places/${item.place_id}`)
                        }
                        className="
                        bg-white/5
                        border
                        border-heritage-gold/20
                        rounded-2xl
                        overflow-hidden
                        hover:scale-105
                        transition
                        cursor-pointer
                        "
                      >

                        <img
                          src={item.image_url || heroImg}
                          alt={item.name}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4">

                          <h3 className="font-semibold">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-400 mt-2">
                            {item.city}, {item.state}
                          </p>

                        </div>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </>

          )}

          
      {/* ================= Gallery ================= */}

      {activeTab === "Gallery" && (

        <div className="mt-14">

          <h2 className="text-3xl font-bold mb-8">
            Gallery
          </h2>

          {gallery.length === 0 ? (

            <p className="text-gray-400">
              No Gallery Images Available.
            </p>

          ) : (

            <div className="grid md:grid-cols-3 gap-6">

              {gallery.map((img) => (

                <div
                  key={img.image_id}
                  className="overflow-hidden rounded-2xl"
                >

                  <img
                    src={img.image_url}
                    alt={img.caption}
                    className="
                    h-72
                    w-full
                    object-cover
                    hover:scale-105
                    transition
                    duration-500
                    "
                  />

                  {img.caption && (

                    <p className="mt-3 text-sm text-gray-400">
                      {img.caption}
                    </p>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      )}

     {/* ================= Reviews ================= */}

{activeTab === "Reviews" && (

<div className="mt-14">

  <h2 className="text-3xl font-bold mb-8">
    Reviews
  </h2>

  {/* ---------- My Review ---------- */}

  <div
    className="
    bg-white/5
    border
    border-heritage-gold/20
    rounded-3xl
    p-6
    mb-10
    "
  >

    <h3 className="text-xl font-semibold mb-6">

      {myReview
        ? "Edit Your Review"
        : "Write a Review"}

    </h3>

    {/* Rating */}

    <div className="mb-5">

      <label className="block mb-2 text-gray-300">
        Rating
      </label>

      <select
        value={reviewForm.rating}
        onChange={(e) =>
          setReviewForm({
            ...reviewForm,
            rating: Number(e.target.value),
          })
        }
        className="
        w-full
        bg-black/30
        border
        border-white/10
        rounded-xl
        px-4
        py-3
        "
      >

        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
        <option value={4}>⭐⭐⭐⭐ (4)</option>
        <option value={3}>⭐⭐⭐ (3)</option>
        <option value={2}>⭐⭐ (2)</option>
        <option value={1}>⭐ (1)</option>

      </select>

    </div>

    {/* Comment */}

    <div>

      <label className="block mb-2 text-gray-300">
        Comment
      </label>

      <textarea
        rows={5}
        value={reviewForm.comment}
        onChange={(e) =>
          setReviewForm({
            ...reviewForm,
            comment: e.target.value,
          })
        }
        className="
        w-full
        bg-black/30
        border
        border-white/10
        rounded-xl
        px-4
        py-3
        resize-none
        "
        placeholder="Share your experience..."
      />

    </div>

    {/* Buttons */}

    <div className="flex gap-4 mt-6">

      <button
        onClick={handleSubmitReview}
        disabled={submittingReview}
        className="
        px-6
        py-3
        rounded-xl
        bg-heritage-gold
        text-black
        font-semibold
        "
      >

        {submittingReview
          ? "Saving..."
          : myReview
          ? "Update Review"
          : "Submit Review"}

      </button>

      {myReview && (

        <button
          onClick={handleDeleteReview}
          className="
          px-6
          py-3
          rounded-xl
          bg-red-600
          hover:bg-red-700
          "
        >
          Delete Review
        </button>

      )}

    </div>

  </div>

  {/* ---------- Other Reviews ---------- */}

  <h3 className="text-2xl font-semibold mb-5">
    Community Reviews
  </h3>

  {reviews.filter(
      (review) =>
        review.review_id !== myReview?.review_id
    ).length === 0 ? (

      <p className="text-gray-400">
        No Reviews Yet.
      </p>

  ) : (

    <div className="space-y-5">

      {reviews
        .filter(
          (review) =>
            review.review_id !== myReview?.review_id
        )
        .map((review) => (

        <div
          key={review.review_id}
          className="
          bg-white/5
          rounded-2xl
          border
          border-white/10
          p-6
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <h4 className="font-semibold text-lg">
                {review.name}
              </h4>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(
                  review.created_at
                ).toLocaleDateString()}
              </p>

            </div>

            <div className="flex items-center gap-1 text-yellow-400">

              <Star
                size={16}
                fill="currentColor"
              />

              {review.rating}

            </div>

          </div>

          <p className="mt-4 text-gray-300 leading-7">

            {review.comment}

          </p>

        </div>

      ))}

    </div>

  )}

</div>

)}

      {/* ================= Nearby ================= */}

      {activeTab === "Nearby" && (

        <div className="mt-14">

          <h2 className="text-3xl font-bold mb-6">
            Nearby Places
          </h2>

          {nearby.length === 0 ? (

            <p className="text-gray-400">
              No Nearby Places Found.
            </p>

          ) : (

            <div className="grid md:grid-cols-2 gap-5">

              {nearby.map((item) => (

                <div
                  key={item.place_id}
                  onClick={() =>
                    navigate(`/places/${item.place_id}`)
                  }
                  className="
                  bg-white/5
                  rounded-2xl
                  border
                  border-white/10
                  p-5
                  cursor-pointer
                  hover:border-heritage-gold
                  transition
                  "
                >

                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    {item.city}, {item.state}
                  </p>

                  <p className="text-heritage-gold mt-3">
                    {item.distance_km} km Away
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      )}
</div>
                  {/* ================= Right Side ================= */}

        <div>

          <div
            className="
            bg-white/5
            backdrop-blur-md
            border
            border-heritage-gold/20
            rounded-3xl
            p-6
            sticky
            top-24
            "
          >

            <h2 className="font-bold text-xl mb-6">
              Visitor Information
            </h2>

            <div className="space-y-5">

  {/* Best Time */}

  <div className="flex gap-3">

    <Clock3 className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Best Time To Visit
      </p>

      <p>
        {details.best_time_to_visit || "Not Available"}
      </p>

    </div>

  </div>

  {/* Visiting Hours */}

  <div className="flex gap-3">

    <Clock3 className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Visiting Hours
      </p>

      <p>
        {details.visiting_hours || "Not Available"}
      </p>

    </div>

  </div>

  {/* Entry Fee */}

  <div className="flex gap-3">

    <Ticket className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Entry Fee
      </p>

      <p>
        {place.entry_fee || "Free"}
      </p>

    </div>

  </div>

  {/* Photography */}

  <div className="flex gap-3">

    <BookOpen className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Photography
      </p>

      <p>
        {details.photography_allowed || "Not Available"}
      </p>

    </div>

  </div>

  {/* Dress Code */}

  <div className="flex gap-3">

    <Bookmark className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Dress Code
      </p>

      <p>
        {details.dress_code || "No Dress Code"}
      </p>

    </div>

  </div>

  {/* Location */}

  <div className="flex gap-3">

    <MapPin className="text-heritage-gold" />

    <div>

      <p className="text-sm text-gray-400">
        Location
      </p>

      <p>
        {place.city}, {place.state}
      </p>

    </div>

  </div>

</div>

            <div className="mt-8 space-y-3">

             <button
  onClick={handleSave}
  className="
  w-full
  py-3
  rounded-xl
  border
  border-heritage-gold/30
  flex
  items-center
  justify-center
  gap-2
  "
>
  <Bookmark
    size={18}
    className={
      savedItems.includes(place.place_id)
        ? "text-heritage-gold fill-heritage-gold"
        : "text-white"
    }
  />

  {savedItems.includes(place.place_id)
    ? "Saved"
    : "Save to Collection"}
</button>

              {story && (

                <button
                  onClick={() =>
                    navigate(`/stories/${story.slug}`)
                  }
                  className="
                  w-full
                  py-3
                  rounded-xl
                  bg-heritage-gold
                  text-black
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  "
                >
                  <BookOpen size={18} />
                  Explore Story
                </button>

              )}

            </div>

          </div>

        </div>

      </div>


    </div>

  </div>
);

};

export default PlaceDetails;