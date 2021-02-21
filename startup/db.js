const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userlogs', {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => log.console(`Mongodb connection failed ${err}`));