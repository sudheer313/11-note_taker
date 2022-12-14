const express=require('express');
const path= require('path');
const db= require('./db/db.json');
const fs=require ('fs');
const { v4: uuidv4 } = require('uuid');
const app=express();
const PORT= process.env.PORT || 3030;
app.use(express.static('public'));

//Middleware for Parsign JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/api/notes', (req, res) => {
    console.log('hitting api/notes route GET request')
    res.json(db)
})

app.get('/notes', (req,res) => {
    console.log('notes GET request file');
    res.sendFile(path.join(__dirname,'./public/notes.html'))
}
)

app.post('/api/notes', (req, res) => {
    console.log('hitting api/notes route POST request')

    let newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(db), (err) => {
        if (err) throw err;
    });
    res.send(db);
})

app.delete(`/api/notes/:id`, (req, res) => {
    console.log("DELETE Request Called for /api endpoint")
    res.send("DELETE Request called");
    // using filter
    //let deleteNote= JSON.parse(data);
    //deleteNote=deleteNote.filter((deleteNote)=>deleteNote.id !==req.params.id)
    const deleteNote=db.findIndex(note => note.id === req.params.id);
    db.splice(deleteNote,1);
    fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) =>{
        if (err) throw err
    })
 })
app.get('*',(req,res)=>{
    console.log('notes * GET request file');
    res.sendFile(path.join(__dirname,'./public/index.html'))
}
)
app.listen(PORT, () => {
    console.log(`Listening at port: http://localhost:${PORT}`)
})

// referred https://github.com/jessamyn27/Notetaker-with-Express
// referred https://github.com/ashachakre0906/note-taker
// https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app