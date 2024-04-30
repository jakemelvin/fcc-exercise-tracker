const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Initialisation de la base de données avec les outils à utiliser

const client = new MongoClient(process.env["MONGO_URI"]);
const db = client.db("fcc-exercise-tracker");
const users = db.collection("users");
const exercisesDb = db.collection("exercises");

// Gestion de l'ajout et de l'affichage des utilisateurs

app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  try {
    const results = await users.insertOne({ username: username });
    console.log(results);
    const userInserted = await users.findOne({ username: username });
    return res.status(200).json(userInserted);
  } catch (error) {
    res
      .status(404)
      .json({ error: `An error: ${error} occured. Please try again!!` });
  }
});

// Gestion de l'affichage de tous les utilisateurs

app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await users.find().toArray();
    return res.status(200).json(allUsers);
  } catch (error) {
    res
      .status(404)
      .json({ error: `An error ${error} occured. Please try again!` });
  }
});

// Gestion du post des exercises sur la base de données et leur affichage

app.post("/api/users/:id/exercises", async (req, res) => {
  const id = req.params.id;
  try {
    const correspondantUser = await users.findOne({ _id: new ObjectId(id) });
    if (!correspondantUser) {
      return res.status(404).json({
        error: "Could not find the user requested. Please enter a valid id",
      });
    } else {
      const exercise = {
        user_id: correspondantUser._id,
        description: req.body.description,
        duration: Number(req.body.duration),
        date: req.body.date
          ? new Date(req.body.date).getTime()
          : new Date().getTime(),
      };
      const results = await exercisesDb.insertOne(exercise);
      console.log(results);
      return res.status(200).json({
        ...correspondantUser,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      });
    }
  } catch (error) {
    res
      .status(404)
      .json({ error: `This error: ${error} occured. Please try again!` });
  }
});

// Gestion du log et la récupération de tous les exercises

app.get("/api/users/:id/logs", async (req, res) => {
  const id = req.params.id;
  const { from, to, limit } = req.query;
  if (from) fromDate = new Date(from).getTime();
  if (to) toDate = new Date(to).getTime();
  if (limit) limitNumber = parseInt(limit);
  try {
    const userToGet = await users.findOne({ _id: new ObjectId(id) });
    if (!userToGet) {
      return res
        .status(404)
        .json({ error: `This error occured ${error}. Please try again!` });
      //A FAIRE JE DOIS CONTINUER ICI ET TRAVAILLER
    } else {
      if (from || to || limit) {
        if (from && !to) {
          if (limit) {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $gte: fromDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .limit(limitNumber)
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          } else {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $gte: fromDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          }
        }
        if (to && !from) {
          if (limit) {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $lte: toDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .limit(limitNumber)
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          } else {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $lte: toDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          }
        }
        if (from && to) {
          if (limit) {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $gte: fromDate, $lte: toDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .limit(limitNumber)
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          } else {
            const allExercises = await exercisesDb
              .find(
                {
                  user_id: new ObjectId(id),
                  date: { $gte: fromDate, $lte: toDate },
                },
                { projection: { user_id: 0, _id: 0 } }
              )
              .toArray();

            const arrExercises = [...allExercises];
            return res.status(200).json({
              ...userToGet,
              count: arrExercises.length,
              log: arrExercises.filter((exo) => {
                exo.date = new Date(exo.date).toDateString();
                return exo;
              }),
            });
          }
        }
        if (!from && !to && limit) {
          const allExercises = await exercisesDb
            .find(
              {
                user_id: new ObjectId(id),
              },
              { projection: { user_id: 0, _id: 0 } }
            )
            .limit(limitNumber)
            .toArray();

          const arrExercises = [...allExercises];
          return res.status(200).json({
            ...userToGet,
            count: arrExercises.length,
            log: arrExercises.filter((exo) => {
              exo.date = new Date(exo.date).toDateString();
              return exo;
            }),
          });
        }
      } else {
        const allExercises = await exercisesDb
          .find(
            { user_id: new ObjectId(id) },
            { projection: { user_id: 0, _id: 0 } }
          )
          .toArray();
        const arrExercises = [...allExercises];
        return res.status(200).json({
          ...userToGet,
          count: arrExercises.length,
          log: arrExercises.filter((exo) => {
            exo.date = new Date(exo.date).toDateString();
            return exo;
          }),
        });
      }

      // const newArray = [...arrExercises];
      // const { from, to, limit } = req.query;
      // if (from) {
      //   const fromDate = new Date(from).getTime();
      //   newArray = newArray.filter(
      //     (exe) => new Date(exe.date).getTime() >= fromDate
      //   );
      // }
      // if (to) {
      //   const toDate = new Date(top).getTime();
      //   newArray = newArray.filter(
      //     (exe) => new Date(exe.date).getTime() <= toDate
      //   );
      // }
      // if (limit) {
      //   newArray = newArray.slice(0, Number(limit));
      // }

      // Gerer la prise en charge de from to et limit
    }
  } catch (error) {
    return res
      .status(404)
      .json({ error: `This error occured: ${error}. Please try again` });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
