from flask import Flask
from endpoints.users import users_blueprint
from endpoints.auth import auth_blueprint
from models import db
from dotenv import load_dotenv
from os import environ
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta


load_dotenv()

app = Flask(__name__)

db_type = environ.get("DB_TYPE")
db_user = environ.get("DB_USER")
db_pass = environ.get("DB_PASS")
db_host = environ.get("DB_HOST")
db_port = environ.get("DB_PORT")
db_name = environ.get("DB_NAME")

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = f"{db_type}://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

app.config["JWT_SECRET_KEY"] = environ.get("AUTH_SECRET")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=3)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

CORS(
    app,
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    supports_credentials=True,
)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()


app.register_blueprint(users_blueprint, url_prefix="/users")
app.register_blueprint(auth_blueprint, url_prefix="/auth")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)