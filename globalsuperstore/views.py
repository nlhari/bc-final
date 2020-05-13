"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from globalsuperstore import app

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
