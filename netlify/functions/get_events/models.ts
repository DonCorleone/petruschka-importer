export interface Movie {
    _id:                string;
    plot:               string;
    genres:             string[];
    runtime:            number;
    cast:               string[];
    num_mflix_comments: number;
    title:              string;
    fullplot:           string;
    countries:          string[];
    released:           Date;
    directors:          string[];
    rated:              string;
    awards:             Awards;
    lastupdated:        Date;
    year:               number;
    imdb:               Imdb;
    type:               string;
    tomatoes:           Tomatoes;
    poster?:            string;
    languages?:         string[];
}

export interface Awards {
    wins:        number;
    nominations: number;
    text:        string;
}

export interface Imdb {
    rating: number;
    votes:  number;
    id:     number;
}

export interface Tomatoes {
    viewer:      Critic;
    lastUpdated: Date;
    fresh?:      number;
    critic?:     Critic;
    rotten?:     number;
}

export interface Critic {
    rating:     number;
    numReviews: number;
    meter:      number;
}
