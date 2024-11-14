import { createBrowserRouter } from 'react-router-dom';

import { AuthedLayout } from '@/components/blocks/authed';
import { RootLayout } from '@/components/blocks/root-layout';
import { loader as routeGuardLoader, RouteGuard } from '@/components/blocks/route-guard';
import { ForgotPassword } from '@/routes/forgot-password';
import { HomePage } from '@/routes/home';
import { InterviewsPage } from '@/routes/interview';
import { InterviewRoomContainer, loader as interviewRoomLoader } from '@/routes/interview/[room]';
import { Login } from '@/routes/login';
import { Match } from '@/routes/match';
import { loader as topicsLoader } from '@/routes/match/logic';
import { loader as questionsLoader, Questions } from '@/routes/questions';
import { loader as questionDetailsLoader, QuestionDetailsPage } from '@/routes/questions/details';
import { SignUp } from '@/routes/signup';

import { queryClient } from './query-client';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <RouteGuard />,
        loader: routeGuardLoader(queryClient),
        children: [
          {
            element: <AuthedLayout />,
            children: [
              {
                path: ROUTES.HOME,
                element: <HomePage />, // A temporary redirect to /questions for now.
              },
              {
                path: ROUTES.QUESTIONS,
                loader: questionsLoader,
                // loader: questionsLoader(queryClient),
                element: <Questions />,
              },
              {
                path: ROUTES.QUESTION_DETAILS,
                loader: questionDetailsLoader(queryClient),
                element: <QuestionDetailsPage />,
              },
              {
                path: ROUTES.INTERVIEWS,
                element: <InterviewsPage />,
              },
              {
                path: ROUTES.INTERVIEW,
                loader: interviewRoomLoader,
                element: <InterviewRoomContainer />,
              },
              {
                path: ROUTES.MATCH,
                loader: topicsLoader(queryClient),
                element: <Match />,
              },
            ],
          },
          {
            path: ROUTES.LOGIN,
            element: <Login />,
          },
          {
            path: ROUTES.SIGNUP,
            element: <SignUp />,
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
]);
