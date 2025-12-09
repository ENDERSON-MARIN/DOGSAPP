const { Dog, Temperament } = require("../db.js");
const { Op } = require("sequelize");
const { getAllDogs, getDogsDb } = require("../controllers/index");

/* GET ALL DOGS FROM DB-API OR BY NAME WITH ASYNC - AWAIT */
// const getAllDogsOrByName = async (req, res, next) => {
//   try {
//     const { name } = req.query;
//     const allDogs = await getAllDogs();
//     if (name) {
//       const dogsByName = allDogs.filter((dog) =>
//         dog.name.toLowerCase().includes(name.toLowerCase())
//       );
//       dogsByName.length
//         ? res.status(200).send(dogsByName)
//         : res.status(404).send(`Dog with name ${name} not exist!`);
//     } else {
//       res.status(200).send(allDogs);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

/* GET ALL DOGS OR BY NAME WITH PROMISES */
const getAllDogsNamePromise = (req, res, next) => {
  const { name } = req.query;
  getAllDogs()
    .then((allDogs) => {
      if (name) {
        const dogsFiltered = allDogs.filter((dogs) =>
          dogs.name.toLowerCase().includes(name.toLowerCase())
        );
        dogsFiltered.length
          ? res.status(200).send(dogsFiltered)
          : res.status(404).send(`Dog with name ${name} not exist!`);
      } else {
        res.status(200).send(allDogs);
      }
    })
    .catch((error) => next(error));
};

/* GET ONE DOG BY ID FROM DB OR API */
const getAllDogsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    //si el id es mayor a 7 y el tipo de dato es string busco en la base de datos por el UUID
    if (id.length > 7 && typeof id === "string") {
      const DogsDb = await getDogsDb();
      const DogByIdDb = DogsDb.find((d) => d.id === id);
      if (DogByIdDb) {
        res.status(200).json(DogByIdDb);
      } else {
        res.status(404).send(`Dog with id ${id} not exist in the DB!`);
      }
    } else {
      const allDogs = await getAllDogs();
      const DogByIdApi = allDogs.find((e) => e.id === Number(id));
      if (DogByIdApi) {
        res.status(200).json(DogByIdApi);
      } else {
        res.status(404).send(`Dog with id ${id} not exist in the API!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

/* CREATE NEW DOG IN THE DATABASE */
const createDog = async (req, res, next) => {
  try {
    /* ME TRAIGO TODOS LOS VALORES DEL CUERPO DE LA PETICION */
    const {
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
      temperaments,
    } = req.body;
    /* CREO EL NUEVO DOG */
    const newDog = await Dog.create({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
    });
    /* BUSCO DENTRO DEL MODELO DE TEMPERAMENTOS CUYOS NOMBRES COINCIDAN CON LOS QUE ME PASA EL CLIENTE */
    let temperamentsInDb = await Temperament.findAll({
      where: {
        id: {
          [Op.in]: temperaments,
        },
      },
    });

    /* AGREGO AL NUEVO DOG LOS TEMPERAMENTOS MEDIANTE EL ADD */
    newDog.addTemperament(temperamentsInDb);
    res.status(200).json({
      succMsg: "Dog Created Successfully!",
      newDog,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE ONE DOG IN THE DATABASE */
const updateDog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
      temperaments,
    } = req.body;

    /* BUSCO EL DOG DE LA BD POR EL ID */
    let dogDb = await Dog.findOne({
      where: {
        id: id,
      },
    });
    /* ACTUALIZO EL DOG CON LOS DATOS QUE RECIBO DEL BODY */
    const updatedDog = await dogDb.update({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
    });
    /* BUSCO DENTRO DEL MODELO DE TEMPERAMENTS LOS QUE COINCIDAN CON LOS QUE RECIBO DEL BODY */
    let temperamentsDb = await Temperament.findAll({
      where: {
        id: {
          [Op.in]: temperaments,
        },
      },
    });
    /* SETEO LOS TEMPERAMENTS AL OBJETO DE DOG */
    await updatedDog.setTemperaments(temperamentsDb);
    res.status(200).send({
      succMsg: "Dog Updated Successfully!",
      updatedDog,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE DOG IN THE DATABASE */
const deleteDog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dogDb = await Dog.findByPk(id);

    if (dogDb === null) {
      return res.status(400).send("Dog not found!");
    } else {
      await dogDb.destroy();
      return res.status(200).send("Dog Deleted Successfully! ");
    }
  } catch (error) {
    next(error);
  }
};

/* DELETE DOG IN THE DATABASE WITH PROMISES*/
// const deleteDog = (req, res, next) => {
//   const { id } = req.params;

//   Dog.findByPk(id)
//     .then((dogBd) => {
//       if (dogBd === null) {
//         return res.status(400).send("Dog not found!");
//       } else {
//         dogBd.destroy();
//         return res.status(200).send("Dog Deleted Successfully! ");
//       }
//     })
//     .catch((error) => next(error));
// };

module.exports = {
  getAllDogsNamePromise,
  getAllDogsById,
  createDog,
  updateDog,
  deleteDog,
};
