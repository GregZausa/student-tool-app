import React from "react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const posts = [
    {
      title: "Active Recall: The Most Effective Study Method",
      slug: "/blog/active-recall",
    },
    {
      title: "Why Rereading Notes Doesn’t Work",
      slug: "/blog/rereading-notes",
    },
    {
      title: "Pomodoro Technique Explained for Students",
      slug: "/blog/pomodoro-technique",
    },
    {
      title: "How to Stop Procrastinating as a Student",
      slug: "/blog/procrastination",
    },
    {
      title: "Best Study Habits for Students",
      slug: "/blog/study-habits",
    },
    {
      title: "How to Improve Your GPA Effectively",
      slug: "/blog/improve-gpa",
    },
    {
      title: "Spaced Repetition Explained Simply",
      slug: "/blog/spaced-repetition",
    },
    {
      title: "How to Study Without Burnout",
      slug: "/blog/burnout",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Stud IQ Blog
        </h1>

        <p className="text-slate-400 mb-10">
          Evidence-based study guides, productivity techniques, and learning strategies
          designed to help students improve academic performance.
        </p>

        <div className="grid md:grid-cols-2 gap-4">

          {posts.map((post, i) => (
            <div
              key={i}
              onClick={() => navigate(post.slug)}
              className="cursor-pointer bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition"
            >
              <h2 className="text-indigo-300 font-semibold">
                📘 {post.title}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Read full guide →
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Blog;