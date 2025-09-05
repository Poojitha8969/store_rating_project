import { body, query } from "express-validator";

// ========= Field-level validators =========
export const nameRule = body("name")
  .notEmpty()
  .withMessage("Name is required");

export const emailRule = body("email")
  .isEmail()
  .withMessage("Valid email is required");

export const passwordRule = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters");

export const addressRule = body("address")
  .notEmpty()
  .withMessage("Address is required");

export const ratingRule = body("rating")
  .isInt({ min: 1, max: 5 })
  .withMessage("Rating must be between 1 and 5");

// ========= Grouped rules =========
export const signupRules = [nameRule, emailRule, passwordRule, addressRule];
export const loginRules = [emailRule, passwordRule];

// ========= List / Pagination =========
export const listParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "createdAt"])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'")
];