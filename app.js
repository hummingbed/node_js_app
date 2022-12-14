//native imorts
const fs = require('fs');

//third party imports
const express = require('express');
const app = express();
const port = 9000;
app.use(express.json())

const toursPath = `${__dirname}/data/tours-simple.json`;
const tours = fs.readFileSync(toursPath)

//homepage url
app.get('/', (req, res) => {
    res.status(200).json([{message: 'hello world'}]);
});

//get all tours
app.get('/tours', (req, res) => {
    const toJson = JSON.parse(tours);
    res.status(200).json({
        status: 'success',
        results: toJson.length,
        data: { tours: toJson }
    });
});

//get tours by id
app.get('/tours/:id', (req, res) => {
    console.log(req.params)

    const toJson = JSON.parse(tours);
    const id = req.params.id * 1;
    const tour = toJson.find(el => el.id === id);

    if(id > toJson.length){
        return res.status(404).json({
            status: 'fail request',
            message: `invalid id ${id}`
        })
    }
    res.status(200).json({
        status: 'success',
        results: toJson.length,
        data: { tours: tour }
    });
});

//create new tours
app.post('/tours', (req, res) => {
    const toJson = JSON.parse(tours);
    const newId = toJson.length;
    const addOne = newId +1;
    const newTour = Object.assign({id: addOne}, req.body);
    toJson.push(newTour);
    fs.writeFile(toursPath, JSON.stringify(toJson), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
});

app.listen(port, (localhost) => {
    console.log('app running');
});