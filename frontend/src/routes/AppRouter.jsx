import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import GPACalculator from "../pages/GPACalculator";
import PomodoroTimer from "../pages/PomodoroTimer";
import QuizGenerator from "../pages/QuizGenerator";
import TodoList from "../pages/TodoList";
import DashboardLayout from "../pages/DashboardLayout";
import DashboardOverview from "../pages/DashboardOverview";
import Deadlines from "../pages/Deadline";
import Notes from "../pages/Notes";
import Materials from "../pages/Materials";
import MyDecks from "../pages/MyDecks";
import DeckEditor from "../pages/DeckEditor";
import StudyMode from "../pages/StudyMode";
import ExplorePage from "../pages/ExplorePage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-of-service", element: <TermsOfService /> },
  { path: "/explore", element: <ExplorePage /> },
  { path: "/study/:id", element: <StudyMode /> },

  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "todos", element: <TodoList /> },
      { path: "deadlines", element: <Deadlines /> },
      { path: "notes", element: <Notes /> },
      { path: "materials", element: <Materials /> },
      { path: "pomodoro", element: <PomodoroTimer /> },
      { path: "gpa-calculator", element: <GPACalculator /> },
      { path: "quiz-generator", element: <QuizGenerator /> },
      { path: "decks", element: <MyDecks /> },
      { path: "decks/:id", element: <DeckEditor /> },
      { path: "decks/:id/study", element: <StudyMode /> },
      { path: "explore", element: <ExplorePage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
