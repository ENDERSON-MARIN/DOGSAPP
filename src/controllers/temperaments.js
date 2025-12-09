const { getAllTemperaments } = require("./index.js");

const getAllDogsTemperaments = async (req, res) => {
  try {
    let allDogsTemperaments = await getAllTemperaments();

    allDogsTemperaments = allDogsTemperaments.map((t) => {
      return {
        id: t.id,
        name: t.name,
      };
    });
    res.send(allDogsTemperaments);
  } catch (error) {
    res.send({ errMsg: error });
  }
};

module.exports = {
  getAllDogsTemperaments,
};
