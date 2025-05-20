const express = require('express')
// const { exec } = require('child_process')
// const path = require('path')
const movies = require('./movies.json') 
const axios = require('axios')

const app = express();
const port = 3000; 

app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', 'https://3mtt-movie-recommendation.netlify.app')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Expose-Headers', 'Authorization')
    next(); 
});
app.use(express.json())

app.get("/recommend", async (req, res) => {
    const movieTitle = req.query.title;
  
    if (!movieTitle) {
      return res
        .status(400)
        .json({
            status: false, 
            message: "Missing movie title query parameter" 
        });
    }
  
    try {
      
      const encodedMovieTitle = encodeURIComponent(movieTitle);
      const pythonApiEndpoint = `https://recommend-flask.onrender.com/recommend?title=${encodedMovieTitle}`;
  
      console.log(`Calling Python API: ${pythonApiEndpoint}`);
  
      const response = await axios.get(pythonApiEndpoint);
  
      const recommendations = response.data;
  
      res.status(200).json({
        message: 'Recommendations fetched successfully',
        status: true,
        data: recommendations
    });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get recommendations from Python API',
            status: false,
            details: error.message,
        });
    
    }
});


app.get('/movies', (req, res) => {
    try{
        const movieList = movies.map(movie => ({
            Title: movie.Series_Title,
            Released_Year: movie.Released_Year,
            Certificate: movie.Certificate,
            Runtime: movie.Runtime,
            Genre: movie.Genre,
            overview: movie.Overview,
            IMDB_Rating: movie.IMDB_Rating,
            Director: movie.Director,
            Stars: movie.Stars,
        }))
        res.status(200).json({
            message: "Movie list fetched successfully",
            status: true,
            data: movieList,
        });
    }catch{
        res.status(500).json({
            message: "Internal Server Error",
            status: false
        });
    }
})
app.get('/', (req, res) => {
    res.send('Movie Recommendation API is up and running....Cheers! Thanks 3MTT for this amazing opportunity to learn and grow.')
});


app.listen(port, () => {
    console.log(`Movie Recommendation API listening at http://localhost:${port}`);
});