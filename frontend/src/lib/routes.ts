export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  HOME: '/',
  QUESTIONS: '/questions',
  QUESTION_DETAILS: '/questions/:questionId',
  MATCH: '/match',
  COLLAB: '/collab/:roomId',
};

const TOP_LEVEL_AUTHED_ROUTES = {
  [ROUTES.QUESTIONS]: [
    {
      path: ROUTES.QUESTIONS,
      title: 'Questions',
    },
  ],
  [ROUTES.MATCH]: [
    {
      path: ROUTES.MATCH,
      title: 'Start Match',
    },
  ],
  [ROUTES.COLLAB]: [
    {
      path: ROUTES.COLLAB,
      title: 'Collab',
    },
  ],
};

export type BreadCrumb = {
  path: string;
  title: string;
};

export const getBreadCrumbs = (path: string): Array<BreadCrumb> => {
  for (const key of Object.keys(TOP_LEVEL_AUTHED_ROUTES)) {
    if (path.startsWith(key)) {
      return [
        {
          path: ROUTES.HOME,
          title: 'Home',
        },
        ...TOP_LEVEL_AUTHED_ROUTES[key],
      ];
    }
  }
  return [];
};

export const UNAUTHED_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD];

const TITLES: Record<string, string> = {
  [ROUTES.LOGIN]: 'Start Interviewing Today',
  [ROUTES.SIGNUP]: 'Create an Account',
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTES.HOME]: 'Peerprep',
  [ROUTES.QUESTIONS]: 'Browse Questions',
  [ROUTES.MATCH]: 'Match With A Partner',
  [ROUTES.COLLAB]: 'Collaborate',
};

export const getPageTitle = (path: string) => {
  const title = TITLES[path];
  return title ?? 'Peerprep';
};
