const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()
const port = 4000
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello server');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
//const uriLocal ="mongodb://localhost:27017/ma-societeDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const uriCloud = "mongodb+srv://anis:anis1234@clustermern.pztmm.mongodb.net/ma-societedbc?retryWrites=true&w=majority"
mongoose.connect(uriCloud, { useNewUrlParser: true , useUnifiedTopology: true }).then(()=> console.log("successfully connexion DB"));

const Schema = mongoose.Schema;
let departSchema = new Schema({
    code : String,
    nom : String,
});
let Depart = mongoose.model("departements", departSchema);

// méthode GET - affichage des départements 
app.get("/departements", (req, res) => {
    Depart.find({}, (err,results) => {
        if (!err) {
            res.send(results);
      }
    });
  });

// méthode POST - ajout département
app.post("/add", async function (req, res) {
    console.log(req.body)
    let newDepart = new Depart(req.body);
    console.log(newDepart)
    try{
        await newDepart.save();
        res.status(200).send({message : `${newDepart.nom} is succussffully added`});
    }
    catch(err){
        res.status(400).send({error : `error adding newDepart ${err}`})
    }
  });

  // méthode put - mise à jour département
  app.put("/update/:id", async function (req, res) {
    try{
        const depart = await Depart.findByIdAndUpdate(req.params.id, req.body);
        await depart.save();
        res.status(200).send({message : `${depart.nom} is succussffully updated`});

    }
    catch(err){
        res.status(400).send({error : `error updating department ${err}`})
    }
  });

  // méthode delete - suppression d'un département
app.delete("/delete/:id", async function (req, res) {
    try{
        const depart = await Depart.findByIdAndDelete(req.params.id);
        res.status(200).send({message : `${depart.nom} is succussffully deleted`});
    }
    catch(err){
        res.status(400).send({error : `error deleting department ${err}`})
    }
  });