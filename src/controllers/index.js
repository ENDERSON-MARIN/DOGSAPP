const axios = require("axios").default;
const { Dog, Temperament } = require("../db");
const { API_KEY } = process.env;

/* GET ALL DOGS FROM THE API */
const getDogsApi = async () => {
  try {
    const dataApi = (
      await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    ).data;
    const apiDogs = dataApi.map((e) => {
      return {
        id: e.id,
        name: e.name,
        height_min: Number(e.height.metric.split("-")[0] || NaN),
        height_max: Number(e.height.metric.split("-")[1] || NaN),
        weight_min: Number(e.weight.metric.split("-")[0] || NaN),
        weight_max: Number(e.weight.metric.split("-")[1] || NaN),
        years_life: e.life_span || "Not found",
        image:
          e.image.url ||
          "https://img.freepik.com/premium-photo/cute-confused-little-dog-with-question-marks_488220-4972.jpg?w=2000",
        temperaments: e.temperament || "Not found",
      };
    });
    return apiDogs;
  } catch (error) {
    // Axios 1.x error handling pattern
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `API request failed with status ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
      throw new Error("No response received from API");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Request Error:", error.message);
      throw error;
    }
  }
};

/* GET DOGS FROM THE DB */
const getDogsDb = async () => {
  try {
    const dogsDb = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ["name"],
      },
    });

    const dogsWithTemperaments = dogsDb.map((d) => {
      return {
        id: d.dataValues.id,
        name: d.dataValues.name,
        height_min: d.dataValues.height_min,
        height_max: d.dataValues.height_max,
        weight_min: d.dataValues.weight_min,
        weight_max: d.dataValues.weight_max,
        years_life: d.dataValues.years_life,
        image: d.dataValues.image,
        temperaments: d.dataValues.temperaments
          .map((t) => t.dataValues.name)
          .join(", "),
      };
    });
    return dogsWithTemperaments;
  } catch (error) {
    console.log(error);
  }
};

/* GET ALL DOGS FROM API AND DB */
const getAllDogs = async () => {
  try {
    const dogsApi = await getDogsApi();
    const dogsDb = await getDogsDb();
    const allDogs = [...dogsApi, ...dogsDb];
    // console.log( `all dogs = ${allDogs}`)
    return allDogs;
  } catch (error) {
    console.error("Error getting all dogs:", error.message);
    throw error;
  }
};

/* GET ALL TEMPERAMENTS */
const getAllTemperaments = async () => {
  try {
    const dataApi = (
      await axios(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    ).data;
    let temperaments = dataApi.map((e) => e.temperament); //Los mapeo y devuelvo los temperamentos

    let temperamentsArray = temperaments.join().split(","); //los une y convierte a array

    temperamentsArray = temperamentsArray.map((t) => t.trim()).sort(); //los ordena

    const setTemperaments = new Set(temperamentsArray); //quita los duplicados

    setTemperaments.forEach((temp) => {
      if (temp.length > 0) {
        Temperament.findOrCreate({
          where: { name: temp },
        });
      }
    });

    const allTemperaments = await Temperament.findAll();
    return allTemperaments;
  } catch (error) {
    // Axios 1.x error handling pattern
    if (error.response) {
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `API request failed with status ${error.response.status}`
      );
    } else if (error.request) {
      console.error("API No Response:", error.request);
      throw new Error("No response received from API");
    } else {
      console.error("Error getting temperaments:", error.message);
      throw error;
    }
  }
};

module.exports = {
  getDogsApi,
  getDogsDb,
  getAllDogs,
  getAllTemperaments,
};
