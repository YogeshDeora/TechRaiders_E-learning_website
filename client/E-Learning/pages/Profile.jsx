import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Header from "../components/Header";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
    role: "",
    enrolledCourses: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePic: user.profilePic || "/profile-placeholder.jpg",
        role: user.role || "",
        enrolledCourses: user.enrolledCourses || [],
      });
    }
  }, [user]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Updated Profile
  const handleSave = async () => {
    if (!user?.id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/users/${user.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  // Add Course & Update Backend
  const handleAddCourse = async () => {
    const newCourse = prompt("Enter course name:");
    if (newCourse) {
      try {
        const updatedCourses = [...formData.enrolledCourses, newCourse];

        const token = localStorage.getItem("token");
        await axios.put(
          `/api/users/${user.id}`,
          { ...formData, enrolledCourses: updatedCourses },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setFormData((prev) => ({
          ...prev,
          enrolledCourses: updatedCourses,
        }));
        setUser((prevUser) => ({
          ...prevUser,
          enrolledCourses: updatedCourses,
        }));
      } catch (error) {
        console.error("Error adding course:", error);
      }
    }
  };

  // Remove Course
  const handleRemoveCourse = async (course) => {
    const updatedCourses = formData.enrolledCourses.filter((c) => c !== course);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/users/${user.id}`,
        { ...formData, enrolledCourses: updatedCourses },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      setFormData((prev) => ({
        ...prev,
        enrolledCourses: updatedCourses,
      }));
      setUser((prevUser) => ({
        ...prevUser,
        enrolledCourses: updatedCourses,
      }));
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  // Delete Profile & Log Out
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <p className="text-xl">Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-start bg-zinc-900 text-white py-10 px-6 mt-16">
        <div className="bg-zinc-800 p-10 rounded-xl shadow-2xl w-full transition transform hover:scale-95 duration-300">
          <h1 className="text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
            PROFILE
          </h1>

          <img
            src={formData.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 shadow-md"
          />

          {isEditing ? (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-700 p-2 rounded-lg focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-700 p-2 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-zinc-700 p-2 rounded-lg focus:outline-none"
              />
              <button onClick={handleSave} className="mt-4 bg-green-500 px-6 py-2 rounded-lg">
                Save
              </button>
            </div>
          ) : (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-semibold">{formData.name}</h2>
              <p className="text-gray-400 text-sm">{formData.email}</p>
              <p className="text-gray-300 text-lg font-medium">{formData.role}</p>
              <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 px-6 py-2 rounded-lg">
                Edit Profile
              </button>
            </div>
          )}

          <h3 className="mt-8 text-lg font-semibold text-blue-400">
            Courses you're enrolled in
          </h3>
          {formData.enrolledCourses.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {formData.enrolledCourses.map((course, index) => (
                <li key={index} className="bg-zinc-700 p-3 rounded-lg flex justify-between items-center">
                  {course}
                  <button onClick={() => handleRemoveCourse(course)} className="bg-red-500 px-3 py-1 rounded-lg">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 mt-2">You haven't enrolled yet</p>
          )}

          <button onClick={handleAddCourse} className="mt-4 bg-yellow-500 px-4 py-2 rounded-lg">
            Add Course
          </button>

          <button onClick={handleDelete} className="mt-6 bg-red-600 px-6 py-2 rounded-lg">
            Delete Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
