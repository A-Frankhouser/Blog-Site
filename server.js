const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');


const PORT = process.env.PORT || 3001;
const app = express();

// Sets app to use handlebars engine
app.set('view engine', 'handlebars');

// Handlebar config
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {layout : 'main' });
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));