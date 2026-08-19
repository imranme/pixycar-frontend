import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { setCredentials, logout } from '../features/auth/authSlice';

const apiEnvUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://particularistically-transelementary-owen.ngrok-free.dev';
const BASE_URL = `${apiEnvUrl.replace(/\/$/, '')}/api/v1`;

/* ── Base query with auth header ── */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Skip ngrok warning page for API calls
    headers.set('ngrok-skip-browser-warning', 'true');
    
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/* ── Re-auth wrapper ──
 * If a request fails with 401, try to silently refresh
 * the accessToken using the refresh token, then retry.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Get the current refreshToken from Redux store
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      // No refresh token available — force logout
      api.dispatch(logout());
      return result;
    }

    // Try to get a new accessToken via the SimpleJWT refresh-token endpoint
    const refreshResult = await rawBaseQuery(
      {
        url: '/accounts/token/refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const res = refreshResult.data as {
        access: string;
        refresh?: string;
      };
      
      const currentUser = (api.getState() as RootState).auth.user;
      if (res.access && currentUser) {
        // Store new accessToken + (optional rotated) refreshToken + user in Redux + localStorage
        api.dispatch(
          setCredentials({
            accessToken: res.access,
            refreshToken: res.refresh || refreshToken,
            user: currentUser,
          }),
        );
        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      // Refresh failed — session expired, force logout
      api.dispatch(logout());
    }
  }

  return result;
};

/* ── API slice ── */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Users', 'Dashboard', 'Notifications', 'Listings', 'Communication'],
  endpoints: () => ({}),
});

