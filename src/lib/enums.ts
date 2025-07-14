// Application enums and constants

// User roles
export enum UserRole {
  EP_MEMBER = 'ep-member',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
}

// Auction status
export enum AuctionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  PAUSED = 'paused',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

// Auction types
export enum AuctionType {
  REVERSE = 'reverse',
  FORWARD = 'forward',
  DUTCH = 'dutch',
}

// Bid status
export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

// Notification types
export enum NotificationType {
  AUCTION_CREATED = 'auction_created',
  AUCTION_STARTED = 'auction_started',
  AUCTION_ENDED = 'auction_ended',
  BID_PLACED = 'bid_placed',
  BID_ACCEPTED = 'bid_accepted',
  BID_REJECTED = 'bid_rejected',
  INVITATION_SENT = 'invitation_sent',
  INVITATION_ACCEPTED = 'invitation_accepted',
  INVITATION_DECLINED = 'invitation_declined',
}

// Currency codes
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  CNY = 'CNY',
  JPY = 'JPY',
}

// Time units
export enum TimeUnit {
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

// File types
export enum FileType {
  PDF = 'pdf',
  EXCEL = 'xlsx',
  CSV = 'csv',
  IMAGE = 'image',
}

// Modal types
export enum ModalType {
  CONFIRM_BID = 'confirm_bid',
  CURRENCY_RATE = 'currency_rate',
  DUTY_MODAL = 'duty_modal',
  INVITE_USER = 'invite_user',
  FORGOT_PASSWORD = 'forgot_password',
  OTP = 'otp',
  ONBOARDING = 'onboarding',
  AUCTION_CAPACITY = 'auction_capacity',
  EDITABLE_REVIEW = 'editable_review',
}

// API response status
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
}

// Table sort order
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Form validation types
export enum ValidationType {
  REQUIRED = 'required',
  EMAIL = 'email',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  PATTERN = 'pattern',
  CUSTOM = 'custom',
}

// Socket events
export enum SocketEvent {
  JOIN_AUCTION = 'join_auction',
  LEAVE_AUCTION = 'leave_auction',
  BID_PLACED = 'bid_placed',
  AUCTION_UPDATED = 'auction_updated',
  AUCTION_ENDED = 'auction_ended',
  NEW_MESSAGE = 'new_message',
}

// Local storage keys
export enum StorageKey {
  TOKEN = 'token',
  USER = 'user',
  THEME = 'theme',
  LANGUAGE = 'language',
}

// HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
} 