import React, { useState } from "react";
import Header from "../components/Header";
import {
  FaLaptopCode,
  FaBook,
  FaBrain,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import Courses from "../components/Courses";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="w-full h-screen font-[Inter] bg-gradient-to-b from-[#1E1E2E] to-[#121212] flex flex-col items-center justify-center px-6">
        <div className="max-w-7xl w-full text-center bg-gray-800/90 shadow-lg rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-extrabold text-[#FACC15] drop-shadow-md">
            Unlock Your Potential with the Perfect Course!
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Discover, Learn, and Upskill with our wide range of courses.
          </p>

          {/* Search Input */}
          <div className="mt-6 flex items-center justify-center space-x-3">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full max-w-md px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            />
            <button
              className="bg-[#4F46E5] hover:bg-[#3B37C9] px-5 py-3 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-xl"
              onClick={() => setSearchQuery(searchQuery)} // Ensure search triggers
            >
              Search
            </button>
          </div>
          <p className="text-gray-400 mt-4 text-sm">
            🌟 Explore **1000+ courses** across different categories.
          </p>
          <button className="bg-white px-6 py-2 text-black rounded-lg transition-all mt-10 shadow-md font-semibold cursor-pointer hover:shadow-xl">
            Explore Courses
          </button>
        </div>
        <motion.div
          className="text-3xl font-bold text-white flex flex-col items-center mt-18 "
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaArrowCircleDown className="text-gray-400 text-5xl" />
        </motion.div>
      </section>

      {/* Courses Section with Dynamic Search */}
      <Courses searchQuery={searchQuery} />


      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FACC15]">
            Popular Categories
          </h2>
          <p className="text-gray-300 mt-2">
            Choose from various categories and start learning today!
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { icon: <FaLaptopCode />, title: "Web Development" },
              { icon: <FaBrain />, title: "AI & Machine Learning" },
              { icon: <FaBook />, title: "Data Science" },
              { icon: <FaChalkboardTeacher />, title: "Marketing" },
              { icon: <FaUsers />, title: "Business" },
            ].map((category, index) => (
              <div
                key={index}
                className="p-5 bg-gray-800 rounded-lg flex flex-col items-center"
              >
                <div className="text-3xl text-[#4F46E5]">{category.icon}</div>
                <h3 className="mt-3 font-semibold">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FACC15]">
            Featured Courses
          </h2>
          <p className="text-gray-300 mt-2">
            Handpicked courses for you to get started.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "React for Beginners", instructor: "John Doe" },
              { title: "Python for Data Science", instructor: "Jane Smith" },
              { title: "SEO & Digital Marketing", instructor: "Alex Johnson" },
            ].map((course, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-400 mt-1">
                  Instructor: {course.instructor}
                </p>
                <button className="mt-4 bg-[#4F46E5] px-4 py-2 rounded-lg text-white font-medium hover:bg-[#3B37C9]">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

     
    </>
  );
}

export default Dashboard;
