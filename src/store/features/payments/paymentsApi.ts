import { baseApi } from '../../api/baseApi';
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  VerifySessionResponse,
} from './paymentsApi.types';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStripeCheckoutSession: builder.mutation<CreateCheckoutSessionResponse, CreateCheckoutSessionRequest>({
      query: (data) => ({
        url: '/payments/stripe/create-checkout-session/',
        method: 'POST',
        body: data,
      }),
    }),
    verifyStripeSession: builder.query<VerifySessionResponse, string>({
      query: (sessionId) => `/payments/stripe/verify-session/?session_id=${sessionId}`,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(['Listings', 'Communication']));
        } catch {}
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateStripeCheckoutSessionMutation,
  useVerifyStripeSessionQuery,
} = paymentsApi;
