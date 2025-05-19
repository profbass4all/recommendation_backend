import requests
import pandas as pd
from io import StringIO
import sys 
import json 
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
import numpy as np
import re
from sklearn.preprocessing import MinMaxScaler

def read_gd(sharingurl):
    file_id = sharingurl.split('/')[-2]
    download_url='https://drive.google.com/uc?export=download&id=' + file_id
    url = requests.get(download_url).text
    csv_raw = StringIO(url)
    return csv_raw

def recommend_movies(
    movie_title, 
    movie_collection, 
    text_features=['Overview', 'Series_Title'], 
    categorical_features=['Director', 'Stars', 'Genre','Certificate'], 
    weights={
        "Genre": 5,
        "Director": 3,
        "Certificate": 2,
        'Stars': 4.5,
        'Overview': 4,
        'Series_Title': 2
    }, 
    top_n=15,  
    n_components=100
):
    if movie_collection.empty:
        print(f"Error: Your movie dataframe is empty")
        return []

    movie_collection['Certificate'] = movie_collection['Certificate'].fillna('Unrated')
    movie_collection['Stars'] = movie_collection['Star1'] + '|' + movie_collection['Star2'] + "|" + movie_collection['Star3'] + "|" + movie_collection['Star4']
    required_columns = text_features + categorical_features
    missing_columns = [col for col in required_columns if col not in movie_collection.columns]
    
    output_columns = text_features + categorical_features
    output_columns = [col for col in output_columns if col in movie_collection.columns] 

    if missing_columns:
        print(f'These following columns are empty: {missing_columns}')
        return []

    recommended_indices = []
    try:
    
        vectorizer = TfidfVectorizer(stop_words = 'english')
        text_features_similarity = np.zeros((len(movie_collection), len(movie_collection)))
        
        for feature in text_features:
            vectorizer_matrix = vectorizer.fit_transform(movie_collection[feature])
            svd = TruncatedSVD(n_components=n_components, random_state=42)
            reduced_vectors = svd.fit_transform(vectorizer_matrix)
            weight = weights.get(feature, 1) if weights else 1
            text_features_similarity += weight * cosine_similarity(reduced_vectors)
        

        categorical_features_similarity = np.zeros((len(movie_collection), len(movie_collection)))

        
        for feature in categorical_features:
            movie_collection[feature] = movie_collection[feature].apply(
            lambda x: (
            [item.strip() for item in re.split(r'\|', x) if item.strip()]
            if isinstance(x, str) and str(x).strip() 
            else (
                x if isinstance(x, list)
                else []
            ))
        )
            vectorizer_cat = TfidfVectorizer(tokenizer=lambda x: x, lowercase=False)
            # print('got here')

            vectorizer_matrix = vectorizer_cat.fit_transform(movie_collection[feature])
            # print('got here too')
            weight = weights.get(feature, 1) if weights else 1
            categorical_features_similarity += weight * cosine_similarity(vectorizer_matrix)

        combined_similarity = categorical_features_similarity + text_features_similarity
            
        combined_similarity = MinMaxScaler().fit_transform(combined_similarity)
        
        indices = pd.Series(movie_collection.index, index = movie_collection['Series_Title'])
        index_of_movie = indices[movie_title]
        # print('index_of_movie', index_of_movie)

        if index_of_movie is None:
            print(pd.DataFrame(columns =['Series_Title'] + text_features + categorical_features ))
            return []

        similarity_scores = list(enumerate(combined_similarity[index_of_movie]))

        similarity_scores = sorted(similarity_scores, key = lambda x: x[1], reverse = True)

        # print(similarity_scores)

        recommended_indices = [score[0] for score in similarity_scores if score[1] > 0.0 and score[0] != index_of_movie ]
        
        recommended_movies_df = movie_collection.iloc[recommended_indices]
        
        final_output_df = recommended_movies_df[[col for col in output_columns if col in recommended_movies_df.columns]].head(top_n)
        
        return final_output_df.to_dict(orient='records')

    except Exception as e:
        print(f'An error {e} occurred!')
        return []


if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        print("Error: Please provide a movie title as an argument.", file=sys.stderr)
        sys.exit(1) 

    movie_title_arg = sys.argv[1] 

    url = "https://drive.google.com/file/d/1PEjFZiaD67GsWbVGzfr2uktDp3K6zLxq/view?usp=sharing"
    gdd = read_gd(url)

    if gdd is None: 
        sys.exit(1)

    try:
        df = pd.read_csv(gdd)
    except Exception as e:
        print(f"Error reading CSV into DataFrame: {e}", file=sys.stderr)
        sys.exit(1)


    
    recommendations = recommend_movies(movie_title_arg, df)

    print(json.dumps(recommendations))

    sys.exit(0)
