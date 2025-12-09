const { Router } = require("express");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

/* LINKS TO DOCS JOI AND EXPRESS-JOI-VALIDATION 
https://joi.dev/api/?v=17.6.0
https://github.com/evanshortiss/express-joi-validation#readme
*/

/* SE CREAN LOS OBJETOS CON LOS TIPOS DE VALIDACIONES */
const querySchema = Joi.object({
  name: Joi.string().regex(/^[a-zA-Z\s]+$/),
});

const paramsSchema = Joi.object({
  id: Joi.string().regex(/^([a-zA-Z0-9-]+)$/),
});

const bodySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  height_min: Joi.number().min(1).precision(1).required(),
  height_max: Joi.number().min(1).precision(1).required(),
  weight_min: Joi.number().min(1).precision(1).required(),
  weight_max: Joi.number().min(1).precision(1).required(),
  years_life: Joi.string().min(1).max(50),
  image: Joi.string()
    .regex(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i)
    .max(255),
  temperaments: Joi.array().items(Joi.string().min(1).max(124)).required(),
});

const {
  getAllDogsNamePromise,
  getAllDogsById,
  createDog,
  updateDog,
  deleteDog,
} = require("../controllers/dogs");

const router = Router();

/* SE ARMAN LAS RUTAS PASANDO LAS VALIDACIONES COMO MIDDLEWARES */

/* GET ALL DOGS OR BY NAME */
router.get("/", validator.query(querySchema), getAllDogsNamePromise);

/* GET ALL DOGS BY ID */
router.get("/:id", validator.params(paramsSchema), getAllDogsById);

/* CREATE NEW DOG IN THE DATABASE */
router.post("/", validator.body(bodySchema), createDog);

/* UPDATE DOG IN THE DATABASE */
router.put("/:id", validator.params(paramsSchema), updateDog);

/* DELETE DOG IN THE DATABASE */
router.delete("/:id", validator.params(paramsSchema), deleteDog);

module.exports = router;
