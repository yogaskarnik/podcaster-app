const express = require('express');
const cors = require('cors');
const podcastsRouter = require('./controllers/podcasts');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/podcasts', podcastsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
