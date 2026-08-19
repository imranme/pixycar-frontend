import { baseApi } from '../../api/baseApi';
import type {
  CreateVehicleListingRequest,
  VehicleListingResponse,
  MineListingsResponse,
  MarketplaceListing,
  MarketplaceListingsResponse,
  ListingOffersResponse,
  PlaceBidRequest,
  PlaceBidResponse,
  MyRankResponse,
  MyOffersResponse,
} from './listingsApi.types';

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyListings: builder.query<MineListingsResponse, void>({
      query: () => '/marketplace/listings/mine/',
      providesTags: ['Listings'],
    }),
    createVehicleListing: builder.mutation<VehicleListingResponse, CreateVehicleListingRequest>({
      query: (data) => ({
        url: '/marketplace/listings/vehicle-create/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Listings'],
    }),
    getMarketplaceListings: builder.query<MarketplaceListingsResponse, void>({
      query: () => '/marketplace/listings/',
      providesTags: ['Listings'],
    }),
    getActiveListings: builder.query<MarketplaceListingsResponse, void>({
      query: () => '/marketplace/listings/active/',
      providesTags: ['Listings'],
    }),
    getListingById: builder.query<MarketplaceListing, number | string>({
      query: (id) => `/marketplace/listings/${id}/`,
      providesTags: (_result, _error, id) => ['Listings', { type: 'Listings', id }],
    }),
    getListingBrowseDetail: builder.query<MarketplaceListing, number | string>({
      query: (id) => `/marketplace/listings/${id}/browse/`,
      providesTags: (_result, _error, id) => ['Listings', { type: 'Listings', id }],
    }),
    getListingOffers: builder.query<ListingOffersResponse, number | string>({
      query: (id) => `/marketplace/listings/${id}/offers/`,
      providesTags: (_result, _error, id) => ['Listings', { type: 'Listings', id: `OFFERS_${id}` }],
    }),
    confirmWinner: builder.mutation<{ message: string; thread_id?: number }, { listingId: number | string; dealerId?: number; offerId?: number | string }>({
      query: ({ listingId, dealerId, offerId }) => ({
        url: `/marketplace/listings/${listingId}/confirm-winner/`,
        method: 'POST',
        body: {
          ...(dealerId ? { dealer_id: dealerId } : {}),
          ...(offerId ? { offer_id: offerId } : {}),
        },
      }),
      invalidatesTags: (_res, _err, { listingId }) => [{ type: 'Listings', id: listingId }, 'Communication'],
    }),
    selectWinningDealer: builder.mutation<{ message: string }, { listingId: number | string; dealerId: number }>({
      query: ({ listingId, dealerId }) => ({
        url: `/marketplace/listings/${listingId}/select-dealer/`,
        method: 'POST',
        body: { dealer_id: dealerId },
      }),
      invalidatesTags: (_res, _err, { listingId }) => [{ type: 'Listings', id: listingId }],
    }),
    relistListing: builder.mutation<{ message: string; listing?: MarketplaceListing }, number | string>({
      query: (id) => ({
        url: `/marketplace/listings/${id}/relist/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => ['Listings', { type: 'Listings', id }],
    }),
    uploadListingImages: builder.mutation<{ message: string; thumbnail?: string }, { id: number | string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/marketplace/listings/${id}/upload-images/`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Listings'],
    }),
    placeBid: builder.mutation<PlaceBidResponse, PlaceBidRequest>({
      query: ({ listing_id, amount }) => ({
        url: `/marketplace/listings/${listing_id}/bids/`,
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: (_res, _err, { listing_id }) => ['Listings', { type: 'Listings', id: listing_id }],
    }),
    getMyRank: builder.query<MyRankResponse, number | string>({
      query: (listing_id) => `/marketplace/listings/${listing_id}/my-rank/`,
      providesTags: (_res, _err, listing_id) => ['Listings', { type: 'Listings', id: `RANK_${listing_id}` }],
    }),
    getMyOffers: builder.query<MyOffersResponse, void>({
      query: () => '/marketplace/my-offers/',
      providesTags: ['Listings'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyListingsQuery,
  useCreateVehicleListingMutation,
  useUploadListingImagesMutation,
  useGetMarketplaceListingsQuery,
  useGetActiveListingsQuery,
  useGetListingByIdQuery,
  useGetListingBrowseDetailQuery,
  useGetListingOffersQuery,
  useSelectWinningDealerMutation,
  useConfirmWinnerMutation,
  useRelistListingMutation,
  usePlaceBidMutation,
  useGetMyRankQuery,
  useGetMyOffersQuery,
} = listingsApi;
