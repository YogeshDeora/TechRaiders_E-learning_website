import { useState, useEffect } from "react";
import axios from "axios";

const Courses = ({ searchQuery }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery) return; // Don't fetch if search query is empty

    const fetchCourses = async () => {
      const options = {
        method: "GET",
        url: "https://youtube138.p.rapidapi.com/search/",
        params: {
          q: searchQuery || "programming courses", // Use searchQuery dynamically
          hl: "en",
          gl: "US",
        },
        headers: {
          "x-rapidapi-key": "c2e9878c75msh6c3ee295351478cp13e7d9jsn74595a4b8145",
          "x-rapidapi-host": "youtube138.p.rapidapi.com",
        },
      };

      try {
        setLoading(true);
        const response = await axios.request(options);
        console.log(response);// this line is to be removed
        const results = response.data.contents || [];

        // Extract video data
        const filteredCourses = results
          .filter((item) => item.video) // Ensure it's a video result
          .map((item) => ({
            id: item.video.videoId,
            title: item.video.title,
            thumbnail: item.video.thumbnails?.[0]?.url || "/default-thumbnail.jpg",
            channel: item.video.author?.title || "Unknown Channel",
          }));

        setCourses(filteredCourses);
      } catch (err) {
        console.error("Error fetching YouTube courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery]); // Fetch courses when searchQuery changes

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">YouTube Courses</h1>

      {loading && <p className="text-gray-400">Loading courses...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-400">No courses found.</p>
      )}

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <a
            key={course.id}
            href={`https://www.youtube.com/watch?v=${course.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-transform hover:scale-105"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="mt-3 text-lg font-semibold">{course.title}</h2>
            <p className="text-sm text-gray-400">by {course.channel}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Courses;
