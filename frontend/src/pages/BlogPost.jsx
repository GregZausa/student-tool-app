import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";

const BlogPost = () => {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-slate-800 text-slate-50" : "text-slate-800 bg-slate-50"} flex items-center justify-center flex-col`}
      >
        <h1
          className={`text-2xl font-bold ${isDark ? "bg-slate-800 text-slate-50" : "text-slate-800 bg-slate-50"}`}
        >
          Article not found
        </h1>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 text-indigo-400"
        >
          Go back to blog
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-slate-800 text-slate-50" : "text-slate-800 bg-slate-50"} px-6 py-20`}
    >
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/blog")}
          className="text-indigo-400 mb-6"
        >
          ← Back to Blog
        </button>

        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>

        <div
          className={` ${isDark ? "text-slate-200" : "text-slate-600"} leading-relaxed whitespace-pre-line`}
        >
          {post.content}
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-slate-400">
            Improve your study system with Stud IQ tools.
          </p>

          <Button
            label="Open Stud IQ →"
            onClick={() => navigate("/dashboard")}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
