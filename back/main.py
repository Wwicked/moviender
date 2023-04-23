from flask import Flask
from endpoints.users import users_blueprint
from endpoints.auth import auth_blueprint

app = Flask(__name__)

app.register_blueprint(users_blueprint, url_prefix="/users")
app.register_blueprint(auth_blueprint, url_prefix="/auth")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
