// src/main.tsx (or index.tsx)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";

import LandingPage from "./pages/home/LandingPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

// Auth
import AuthPage from "./pages/auth/page.tsx";
import GetStartedPage from "./pages/auth/GetStartedPage.tsx";
import VerificationPage from "./pages/auth/VerificationPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import ResendVerification from "./pages/auth/ResendPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPasswordPage.tsx";
import ChangePassword from "./pages/auth/ChangePasswordPage.tsx";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";

// Onboarding
import OnboardingLayout from "./pages/onboarding/pages.tsx";
import OnboardingHome from "./pages/onboarding/Onboarding.tsx";
import PersonalInfoPage from "./pages/onboarding/PersonalInfo.tsx";
import SecurityValidationPage from "./pages/onboarding/SecurityValidationPage.tsx";
import DemographicsPage from "./pages/onboarding/Demographics.tsx";
import VoterRegistrationInformationPage from "./pages/onboarding/VoterRegistrationInformation.tsx";
// import PoliticalPrefrencesPage from "./pages/onboarding/PoliticalPreferences.tsx";
// import EngagementAndMobilizationPage from "./pages/onboarding/EngagementAndMobilization.tsx";
// import VotingBehaviorPage from "./pages/onboarding/VotingBehavior.tsx";
// import TechnologyAndAccessPage from "./pages/onboarding/TechnologyAndAccess.tsx";
// import SurveyQuestionsPage from "./pages/onboarding/SurveyQuestions.tsx";

// Profile
import ProfileLayout from "./pages/profile/page.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";

// Contexts
import { ThemeProvider } from "./context/ThemeContexts.tsx";
import { OnboardingProvider } from "./context/OnboardingContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      { path: "sign-up", element: <GetStartedPage /> },
      { path: "verify", element: <VerificationPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "resend", element: <ResendVerification /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "confirm-email/:token", element: <ConfirmEmailPage /> },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <OnboardingProvider>
        <OnboardingLayout />
      </OnboardingProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <OnboardingHome /> },
      { path: "personal-info", element: <PersonalInfoPage /> },
      { path: "security-validation", element: <SecurityValidationPage /> },
      { path: "demographics", element: <DemographicsPage /> },
      {
        path: "voter-registration-information",
        element: <VoterRegistrationInformationPage />,
      },
      // { path: "political-preferences", element: <PoliticalPrefrencesPage /> },
      // {
      //   path: "engagement-and-mobilization",
      //   element: <EngagementAndMobilizationPage />,
      // },
      // { path: "voting-behavior", element: <VotingBehaviorPage /> },
      // {
      //   path: "technology-and-access",
      //   element: <TechnologyAndAccessPage />,
      // },
      // { path: "survey-questions", element: <SurveyQuestionsPage /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <UserProvider>
        <ProfileLayout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <ProfilePage /> }],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
