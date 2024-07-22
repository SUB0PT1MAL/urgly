import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, redirect, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import random
import string

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Domain configuration
DOMAIN = os.environ.get('DOMAIN', 'localhost:5000')

db = SQLAlchemy(app)

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(2048), nullable=False)
    short_url = db.Column(db.String(10), unique=True, nullable=False)
    long_url = db.Column(db.String(2048), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/create', methods=['POST'])
def create_url():
    data = request.json
    original_url = data['url']
    url_type = data['type']
    
    if url_type == 'short':
        new_url = generate_random_string(7)
        url_entry = URL(original_url=original_url, short_url=new_url)
    elif url_type == 'long':
        length = data['length']
        new_url = generate_random_string(int(length))
        url_entry = URL(original_url=original_url, long_url=new_url)
    else:
        return jsonify({'error': 'Invalid URL type'}), 400

    db.session.add(url_entry)
    db.session.commit()
    
    return jsonify({'new_url': f'/redi/{new_url}'})

@app.route('/redi/<string:url_key>')
def redirect_url(url_key):
    url = URL.query.filter((URL.short_url == url_key) | (URL.long_url == url_key)).first_or_404()
    return redirect(url.original_url)

@app.cli.command()
def delete_old_urls():
    week_ago = datetime.utcnow() - timedelta(days=7)
    URL.query.filter(URL.created_at < week_ago).delete()
    db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=os.environ.get('DEBUG', 'False').lower() == 'true')