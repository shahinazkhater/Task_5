import express from "express";

import { createDB } from "../db.js";

import { validateBody ,
  validateQuery,
 validateParams
} from "../middlewares/validation.js";
 

import {
  createAuthorSchema,
  updateAuthorSchema,
  authorIdSchema,
  searchAuthorSchema
} from "../schemas/author.schema.js";

const router = express.Router();

const db = createDB();


// GET /authors
router.get(
  "/",
  validateQuery(searchAuthorSchema),
  async (req, res, next) => {
    try {
      const authors = await db.getAll("authors");

      const {search} = req.query;

      if (search) {
        const filteredAuthors = authors.filter(
          (author) =>
            author.name.toLowerCase() === search.toLowerCase()
        );

        return res.json(filteredAuthors);
      }

      res.json(authors);

    } catch (error) {
      next(error);
    }
  }
);


// GET /authors/:id
router.get(
  "/:id",
  validateParams(authorIdSchema),
  async (req, res, next) => {
    try {
      const authors = await db.getAll("authors");

      const author = authors.find(
        (author) => author.id ===  Number (req.params.id)
      );

      if (!author) {
        const error = new Error("Author not found");
        error.status = 404;

        return next(error);
      }

      res.json(author);

    } catch (error) {
      next(error);
    }
  }
);


// POST /authors
router.post(
  "/",
  validateBody(createAuthorSchema),
  async (req, res, next) => {
    try {
      const authors = await db.getAll("authors");

      const newAuthor = {
        id: authors.length + 1,
        ...req.body
      };

      await db.insert("authors", newAuthor);

      res.status(201).json(newAuthor);

    } catch (error) {
      next(error);
    }
  }
);


// PUT /authors/:id
router.put(
  "/:id",
  validateParams(authorIdSchema),
  validateBody(updateAuthorSchema),
  async (req, res, next) => {
    try {
      const authors = await db.getAll("authors");

      const author = authors.find(
        (author) => author.id ===Number(
     req.params.id)
      );

      if (!author) {
        const error = new Error("Author not found");
        error.status = 404;

        return next(error);
      }

      const updatedAuthor = {
        id: author.id,
        ...req.body
      };

      await db.update(
        "authors",Number
       ( req.params.id ), 
        updatedAuthor
      );

      res.json(updatedAuthor);

    } catch (error) {
      next(error);
    }
  }
);


// DELETE /authors/:id
router.delete(
  "/:id",
  validateParams(authorIdSchema),
  async (req, res, next) => {
    try {
      const deletedAuthor = await db.delete(
        "authors",

     Number(   req.params.id)
      );

      if (!deletedAuthor) {
        const error = new Error("Author not found");
        error.status = 404;

        return next(error);
      }

      res.json({
        message: "Author deleted successfully",
        author: deletedAuthor
      });

    } catch (error) {
      next(error);
    }
  }
);


export default router;