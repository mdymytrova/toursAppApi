const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours.json`));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.addTour = (req, res) => {
  const newTour = {
    ...req.body,
    id: tours.length,
  };
  const updatedTours = JSON.stringify([...tours, newTour]);

  fs.writeFile(`${__dirname}/data/tours.json`, updatedTours, (err, data) => {
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
};

exports.getTourById = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: tours.find((tour) => tour.id === +req.params.id),
    },
  });
};
