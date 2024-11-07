import type { QueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import {
  Await,
  defer,
  type LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import { ROUTES, UNAUTHED_ROUTES } from '@/lib/routes';
import { checkIsAuthed } from '@/services/user-service';
import { useAuthedRoute } from '@/stores/auth-store';

import { Loading } from './loading';

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const route = new URL(request.url);
    const path = route.pathname;
    const isUnauthedRoute = UNAUTHED_ROUTES.includes(path);

    return defer({
      payload: await queryClient.ensureQueryData({
        queryKey: ['isAuthed'],
        queryFn: async () => {
          return {
            authedPayload: await checkIsAuthed(),
            isAuthedRoute: !isUnauthedRoute,
            path,
          };
        },
        staleTime: ({ state: { data } }) => {
          const now = new Date();
          const expiresAt = data?.authedPayload?.expiresAt ?? now;
          return Math.max(expiresAt.getTime() - now.getTime(), 0);
        },
      }),
    });
  };

export const RouteGuard = () => {
  const data = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>['data'];
  const navigate = useNavigate();
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data.payload}>
        {({ authedPayload, isAuthedRoute, path: _p }) => {
          const [isLoading, setIsLoading] = useState(true);
          const hooks = useAuthedRoute();
          useEffect(() => {
            if (authedPayload.isAuthed !== isAuthedRoute) {
              navigate(isAuthedRoute ? ROUTES.LOGIN : ROUTES.HOME);
            }

            const { isAdmin, email, username, userId } = authedPayload;

            if (isAdmin && hooks.setIsAdmin) {
              hooks.setIsAdmin(true);
            }

            if (email && hooks.setEmail) {
              hooks.setEmail(email);
            }

            if (username && hooks.setUsername) {
              hooks.setUsername(username);
            }

            if (userId && hooks.setUserId) {
              hooks.setUserId(userId);
            }

            setIsLoading(false);
          }, [authedPayload]);
          return isLoading ? <Loading /> : <Outlet />;
        }}
      </Await>
    </Suspense>
  );
};
