# Movie Recommendation API
This project provides a simple API endpoint for getting movie recommendations based on a content-based filtering approach using movie metadata. The logic is written in Python and the api are created using the flask framework. Node.js/Express server is used to expose this functionality via a web API.
## Features
Recommends movies based on similarity calculated from text features (Overview, Title) and categorical features (Director, Stars, Genre, Certificate).
Uses TF-IDF and Truncated SVD for processing text features.
Exposes a /recommend API endpoint to get recommendations for a given movie title.
Includes a /movies API endpoint to list all movies in the dataset.

## Prerequisites
Before you begin, ensure you have the following installed:

Node.js 14+: Make sure Node.js is installed.

npm: The Node.js package manager (comes with Node.js).

## Setup

**1. Clone the repository:**

```git clone <repository_url> ```

```cd <repository_directory>```
   
**2. Install Node.js dependencies:**

In the same project directory, run:

```npm install express``` 

**Running the Application**

1. Make sure you have completed the setup steps.  
2. Open your terminal in the project directory.
3. Start the Node.js server:
    ```npm run dev```
   
The server should start and listen on port 3000 (or the port specified in index.js). 

You should see a message like Movie Recommendation API listening at ```http://localhost:3000```

[Postman Documentation](https://documenter.getpostman.com/view/36175815/2sB2qWJ4vC)

