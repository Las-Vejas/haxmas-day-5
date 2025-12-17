import flask
import sqlite3
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = flask.Flask(
    __name__,
    static_folder="static",
    static_url_path="/"
)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day"],
    storage_uri="memory://",
)

conn = sqlite3.connect('recipes.db') 
cursor = conn.cursor()  
cursor.execute('''
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        recipe TEXT NOT NULL,
        nationality TEXT NOT NULL
    )
''')
conn.commit()  
conn.close()

@app.get("/")
def index():
    return flask.send_from_directory("static", "index.html")

if __name__ == "__main__":
    app.run()

@app.post("/recipes")

def create_recipe():
    data = flask.request.get_json()
    name = data.get('name')
    recipe = data.get('recipe')
    nationality = data.get('nationality')
    
    conn = sqlite3.connect('recipes.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO recipes (name, recipe, nationality) VALUES (?, ?, ?)', (name, recipe, nationality))
    conn.commit()
    conn.close()

    return '', 201
    
@app.get("/recipes")
def get_recipes():
    conn = sqlite3.connect('recipes.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, recipe, nationality FROM recipes')
    rows = cursor.fetchall()
    conn.close()
    
    recipes = [{'id': row[0], 'name': row[1], 'recipe': row[2], 'nationality': row[3]} for row in rows]
    return flask.jsonify(recipes)

