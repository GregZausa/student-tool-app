import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import GPACalculator from "../pages/GPACalculator";
import PomodoroTimer from "../pages/PomodoroTimer";
import QuizGenerator from "../pages/QuizGenerator";
import TodoList from "../pages/TodoList";
import DashboardLayout from "../pages/DashboardLayout";
import DashboardOverview from "../pages/DashboardOverview";

const ComingSoon = ({ label }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
    <div className="text-4xl mb-3">🚧</div>
    <div className="text-lg font-semibold text-slate-600">{label}</div>
    <div className="text-sm mt-1">Coming soon...</div>
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/gpa-calculator", element: <GPACalculator /> },
  { path: "/pomodoro-timer", element: <PomodoroTimer /> },
  { path: "/quiz-generator", element: <QuizGenerator /> },
  { path: "/gpa-calculator", element: <GPACalculator /> },
  { path: "/quiz-generator", element: <QuizGenerator /> },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "todos", element: <TodoList /> },
      { path: "deadlines", element: <ComingSoon label="Deadlines" /> },
      { path: "notes", element: <ComingSoon label="Notes" /> },
      { path: "materials", element: <ComingSoon label="Learning Materials" /> },
      { path: "pomodoro", element: <PomodoroTimer /> },
      { path: "gpa-calculator", element: <GPACalculator /> },
      { path: "quiz-generator", element: <QuizGenerator /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
