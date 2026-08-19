import { baseApi } from '../../api/baseApi';
import type {
  ThreadListResponse,
  ThreadMessagesResponse,
  UnlockChatResponse,
  ThreadItem,
  ThreadMessageItem,
  SendMessageRequest,
  SendMessageResponse,
} from './communicationApi.types';

export const communicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getThreads: builder.query<ThreadListResponse | ThreadItem[], void>({
      query: () => '/communication/threads/',
      providesTags: ['Communication'],
    }),
    getThreadMessages: builder.query<ThreadMessagesResponse | ThreadMessageItem[], number | string>({
      query: (threadId) => `/communication/threads/${threadId}/messages/`,
      providesTags: (_res, _err, threadId) => [{ type: 'Communication', id: threadId }],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ threadId, text }) => ({
        url: `/communication/threads/${threadId}/messages/send/`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_res, _err, { threadId }) => [
        { type: 'Communication', id: threadId },
        'Communication',
      ],
    }),
    unlockChat: builder.mutation<UnlockChatResponse, number | string>({
      query: (threadId) => ({
        url: `/communication/threads/${threadId}/unlock/`,
        method: 'POST',
      }),
      invalidatesTags: (_res, _err, threadId) => ['Communication', { type: 'Communication', id: threadId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetThreadsQuery,
  useGetThreadMessagesQuery,
  useSendMessageMutation,
  useUnlockChatMutation,
} = communicationApi;
