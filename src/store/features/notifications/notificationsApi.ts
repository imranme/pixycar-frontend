import { baseApi } from '../../api/baseApi';
import type {
  NotificationItem,
  NotificationListResponse,
  MarkReadRequest,
  MarkReadResponse,
  UnreadCountResponse,
} from './notificationsApi.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse | NotificationItem[], { unread?: boolean } | void>({
      query: (params) => {
        const queryStr = params?.unread ? '?unread=true' : '';
        return `/communication/notifications/${queryStr}`;
      },
      providesTags: ['Notifications'],
    }),
    markNotificationsRead: builder.mutation<MarkReadResponse, MarkReadRequest | void>({
      query: (body) => ({
        url: '/communication/notifications/mark-read/',
        method: 'POST',
        body: body || {},
      }),
      invalidatesTags: ['Notifications'],
    }),
    getUnreadNotificationCount: builder.query<UnreadCountResponse, void>({
      query: () => '/communication/notifications/unread-count/',
      providesTags: ['Notifications'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetUnreadNotificationCountQuery,
} = notificationsApi;
