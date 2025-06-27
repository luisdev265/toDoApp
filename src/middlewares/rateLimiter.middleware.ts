import rateLimit from "express-rate-limit";

/**
 * Global request rate limiter
 * Limits each IP to a maximum number of requests within a specific time window.
 */
const limiter = rateLimit({
  /**
   * Time window for rate limiting in milliseconds.
   * 10 minutes = 600,000 ms.
   */
  windowMs: 10 * 60 * 1000,

  /**
   * Maximum number of requests allowed per IP during the time window.
   */
  max: 100,

  /**
   * Custom message returned when rate limit is exceeded.
   */
  message: {
    error: "Too many requests from this IP, please try again after 10 minutes",
  },
  
  /**
   * Optionally standardize the response format
   */
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
});

export default limiter;
