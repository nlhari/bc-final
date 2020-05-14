"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import Flask,render_template, request
from globalsuperstore import app
import tweepy
import time
import os
from textblob import TextBlob
import pandas as pd


@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/trends')
def trends():
    """Renders the home page."""
    return render_template(
        'trends.html',
        title='Business Trends',
        year=datetime.now().year
    )


@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/plot')
def plot():
    """Renders the contact page."""
    return render_template(
        'plot.html',
        title='Financial Report',
        year=datetime.now().year,
        message='Your Financial report page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/tweepy_search', methods=("POST", "GET"))
def tweepy_search():
    search_term = request.args.get('search_term', '')
    df = pd.DataFrame(columns = ['Tweet Text', 'Sentiment Analysis'])
    def scrape_tweet(search_term):
        auth = tweepy.OAuthHandler("qD4fVgQwYBIKXoRXLYw0wp1cq","5gSkicVE0K8eiUSRFuKVqZXFNWaS4lIpAy7xXwrD4yHjKld7i4")
        auth.set_access_token("1256612855635476484-dD2le9cw3cYxoRwyzey5i1TiOD7EFT","j1k4bDswUzvw6Xr0uxbwUvzzrGB3shahXUGKkrXejhawX")
        api = tweepy.API(auth)
        try:
            api.verify_credentials()
            print("Authentication OK")
        except:
            print("Error during authentication")
        public_tweets = api.search(search_term)
        for tweet in public_tweets:
            print(tweet.text)
            analysis = TextBlob(tweet.text)
            print(analysis.sentiment)
            df.loc[len(df)] = [tweet.text, analysis.sentiment.polarity]
    scrape_tweet(search_term)
    return render_template(
        'tweepy_search.html',
        term=search_term,
        tables = [df.to_html(classes='data', header="true", index=False)]
    )
   
