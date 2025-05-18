const express = require('express')
const { exec } = require('child_process')
const path = require('path')
const movies = require('./movies.json') 

const app = express();
const port = 3000; 

const pythonScriptPath = path.join(__dirname, 'recommendation_script.py');
// const dataUrl = "https://drive.google.com/file/d/1PEjFZiaD67GsWbVGzfr2uktDp3K6zLxq/view?usp=sharing";

app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', 'https://localhost:5173')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Expose-Headers', 'Authorization')
    next(); 
});
app.use(express.json())

app.get('/recommend', (req, res) => {
    const movieTitle = req.query.title; // Get the movie title from query parameters

    if (!movieTitle) {
        return res.status(400).json({ message: 'Missing movie title query parameter (e.g., ?title=Movie Title)', status: false });
    }

    const command = `python "${pythonScriptPath}" "${movieTitle}"`;

    console.log(`Executing Python script: ${command}`);

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => { 
        if (error) {
            console.error(`exec error: ${error}`);
            console.error(`Python stderr: ${stderr}`);
            return res.status(500).json({
                message: 'Failed to get recommendations from Python script.',
                status: false,
                details: stderr.trim() || error.message
            });
        }

        if (stderr) {
            console.warn(`Python stderr: ${stderr}`);
        }

        try {
            const recommendations = JSON.parse(stdout);
            res.status(200).json({
                message: 'Recommendations fetched successfully',
                status: true,
                data: recommendations
            });
        } catch (parseError) {
            console.error(`Failed to parse Python script output: ${parseError}`);
            console.error(`Python stdout: ${stdout}`); 
            res.status(500).json({
                message: 'Failed to parse recommendations from Python script output.',
                status: false,
                details: parseError.message,
                rawOutput: stdout.trim()
            });
        }
    });
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