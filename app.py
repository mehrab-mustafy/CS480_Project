from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    from models import Customer
    return Customer.query.get(int(user_id))

# Import routes after app initialization to avoid circular imports
from routes import *

if __name__ == '__main__':
    print("Starting Flask application...")
    print("Debug mode:", app.debug)
    print("Running on: http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)
