import { RequestHandler } from "express";
import * as yup from "yup";

export const validate =
  (schema: any): RequestHandler =>
  async (req, res, next) => {
    if (!req.body) return res.status(422).json({ error: "Empty body is not acceptedd" });

    // creates an object with the schema provided in the function
    const schemaToValidate = yup.object({ body: schema });
    try {
      // validates the request body against the schema provided above
      await schemaToValidate.validate({ body: req.body }, { abortEarly: true });

      next();
    } catch (error) {
      if (error instanceof yup.ValidationError)
        return res.status(422).json({ error: error.message });
    }
  };
