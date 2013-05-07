from flask import Flask, render_template, _app_ctx_stack, redirect, request, g, jsonify
from sqlite3 import dbapi2 as sqlite3
import json
from random import random

DATABASE = '/var/www/flockstream/flocks.db'
WIDTH = 800
HEIGHT = 600
app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
velocities = []
values = []

def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    sqlite_db = sqlite3.connect(app.config['DATABASE'])
    return sqlite_db

@app.before_request
def before_request():
    g.db = get_db()

@app.teardown_request
def teardown_request(exception):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'db'):
        g.db.close()

def get_connection():
    db = getattr(g, '_db', None)
    if db is None:
        db = g._db = get_db()
    return db

def get_services():
    db = get_connection()
    cur = db.execute('select * from services')
    services = cur.fetchall()
    return services 

def insert_service(name, tags):
    db = get_connection()
    with db:
        cur = db.execute('insert into services(servicename, tags) values (?, ?)',(name, tags))
    return

@app.route('/')
def index():
    services_queried = get_services()
    i = 0;
    services = []
    for i in range(len(services_queried)):
        services += [list(services_queried[i])+[i, random()*WIDTH, random()*HEIGHT ]]
    return render_template('index2.html', services=services)

@app.route('/submit', methods=['POST',])
def submit():
    name = request.form['servicename']
    tags = request.form['tags']
    insert_service(name, tags)
    return redirect('/')

@app.route('/_get_similarity_values', methods=['POST',])
def get_similarity_values():
    services = get_services()
    values = []
    for service in services:
        this_service = []
        for another_service in services:
            this_service += [len(set(service[1].split(',')) & set(another_service[1].split(',')))]
        values += [this_service]
    return jsonify({'values':values})

@app.route('/_get_positions', methods=['POST', ])
def get_positions():
    services_queried = get_services()
    i = 0;
    positions = []
    for i in range(len(services_queried)):
        positions += [[random()*WIDTH, random()*HEIGHT ]]
    return jsonify({'positions': positions})

@app.route('/_clear_all', methods=['POST', 'GET'])
def clear_all():
    db = get_connection()
    with db:
        cur = db.execute('delete from services')
    return redirect('/') 

if __name__=='__main__':
    app.debug = True
    app.run('0.0.0.0')
