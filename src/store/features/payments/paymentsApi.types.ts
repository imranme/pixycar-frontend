export interface CreateCheckoutSessionRequest {
  payment_type: 'LISTING_FEE' | 'BID_FEE' | 'CHAT_UNLOCK';
  listing_id?: number;
  bid_amount?: number | string;
  thread_id?: number;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface VerifySessionResponse {
  status: string;
  message: string;
}
