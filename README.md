# Movie Recommendation API
This project provides a simple API endpoint for getting movie recommendations based on a collaborative filtering approach using movie metadata. It uses a Python script for the recommendation logic and a Node.js/Express server to expose this functionality via a web API.
## Features
Recommends movies based on similarity calculated from text features (Overview, Title) and categorical features (Director, Stars, Genre, Certificate).
Uses TF-IDF and Truncated SVD for processing text features.
Exposes a /recommend API endpoint to get recommendations for a given movie title.
Includes a /movies API endpoint to list all movies in the dataset.
Built with Python (Pandas, Scikit-learn) and Node.js (Express, child_process).

## Prerequisites
Before you begin, ensure you have the following installed:

Python 3.6+: Make sure Python is installed and accessible from your terminal.

pip: The Python package installer (usually comes with Python).

Node.js 14+: Make sure Node.js is installed.

npm: The Node.js package manager (comes with Node.js).

## Setup

**1. Clone the repository:**

```git clone <repository_url> ```

```cd <repository_directory>```

**2.  Install Python dependencies:**

Navigate to the project directory in your terminal and run:

   ```pip install pandas scikit-learn requests numpy```
   
**3. Install Node.js dependencies:**

In the same project directory, run:

```npm install express```

**4. Place your Python script:**

Ensure your Python recommendation script ```(recommendation_script.py)``` and the Node.js server file ```(index.js)``` are in the same directory.

**Data Source**

The application currently reads movie data from a CSV file hosted on Google Drive via a public sharing link. 

**Running the Application**

1. Make sure you have completed the setup steps.  
2. Open your terminal in the project directory.
3. Start the Node.js server:
    ```npm run dev```
   
The server should start and listen on port 3000 (or the port specified in index.js). 

You should see a message like Movie Recommendation API listening at ```http://localhost:3000```

[Postman Documentation](https://documenter.getpostman.com/view/36175815/2sB2qWJ4vC)

