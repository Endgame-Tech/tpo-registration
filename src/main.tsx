import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import LandingPage from "./pages/home/LandingPage.tsx";
// import GetStartedPage from "./pages/onboarding/GetStartedPage.tsx";
// import Dashboard from "./pages/dashboard/Dashboard.tsx";
import VerificationPage from "./pages/auth/VerificationPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";

import ErrorPage from "./pages/ErrorPage.tsx";
import AuthPage from "./pages/auth/page.tsx";
import GetStartedPage from "./pages/auth/GetStartedPage.tsx";
import SecurityValidationPage from "./pages/onboarding/SecurityValidationPage.tsx";
import Onboarding from "./pages/onboarding/pages.tsx";
import PersonalInfoPage from "./pages/onboarding/PersonalInfo.tsx";
import DemographicsPage from "./pages/onboarding/Demographics.tsx";
import PoliticalPrefrencesPage from "./pages/onboarding/PoliticalPreferences.tsx";
import VoterRegistrationInformationPage from "./pages/onboarding/VoterRegistrationInformation.tsx";
import EngagementAndMobilizationPage from "./pages/onboarding/EngagementAndMobilization.tsx";
import VotingBehaviorPage from "./pages/onboarding/VotingBehavior.tsx";
import TechnologyAndAccessPage from "./pages/onboarding/TechnologyAndAccess.tsx";
import SurveyQuestionsPage from "./pages/onboarding/SurveyQuestions.tsx";
import OnboardingPage from "./pages/onboarding/Onboarding.tsx";
import ProfileLayout from "./pages/profile/page.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import { ThemeProvider } from "./context/ThemeContexts.tsx";
import ResendVerification from "./pages/auth/ResendPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPasswordPage.tsx";
import ChangePassword from "./pages/auth/ChangePasswordPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/profile",
    element: <ProfileLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      {
        path: "sign-up",
        element: <GetStartedPage />,
      },
      {
        path: "verify",
        element: <VerificationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "resend",
        element: <ResendVerification />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
    ],
  },

  {
    path: "/onboarding",
    element: <Onboarding />,
    children: [
      {
        path: "",
        element: <OnboardingPage />,
      },
      {
        path: "personal-info",
        element: <PersonalInfoPage />,
      },
      {
        path: "security-validation",
        element: <SecurityValidationPage />,
      },
      {
        path: "demographics",
        element: <DemographicsPage />,
      },
      {
        path: "voter-registration-information",
        element: <VoterRegistrationInformationPage />,
      },
      {
        path: "political-prefrences",
        element: <PoliticalPrefrencesPage />,
      },
      {
        path: "engagement-and-mobilization",
        element: <EngagementAndMobilizationPage />,
      },

      {
        path: "voting-behavior",
        element: <VotingBehaviorPage />,
      },
      {
        path: "technology-and-access",
        element: <TechnologyAndAccessPage />,
      },
      {
        path: "survey-questions",
        element: <SurveyQuestionsPage />,
      },
    ],
  },

  // {
  //   path: "/dashboard",
  //   element: <Dashboard />
  // },
]);

// const root = ReactDOM.createRoot(document.getElementById("root"));
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// reportWebVitals();
