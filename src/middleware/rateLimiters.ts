import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const queryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many query submissions. Please try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
