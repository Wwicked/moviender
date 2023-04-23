from flask import Blueprint, request, jsonify
from models import Config, User, db
from uuid import uuid4
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, create_refresh_token

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.form.to_dict()

    username = data.get("username", "")
    password = data.get("password", "")

    if len(username) == 0 or len(username) > Config.MAX_USER_NAME:
        return jsonify({"message": "Username too long"}), 400

    if len(password) == 0 or len(password) > Config.MAX_USER_PASSWORD:
        return jsonify({"message": "Password too long"}), 400

    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify({"message": "User with that name already exists"}), 409

    user = User(
        secret=str(uuid4()),
        username=username,
        password=pbkdf2_sha256.encrypt(password),
    )

    db.session.add(user)
    db.session.commit()

    data = {
        "access_token": create_access_token(identity=user.secret),
        "refresh_token": create_refresh_token(identity=user.secret),
    }

    return jsonify(data), 201


@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.form.to_dict()

    username = data.get("username", "")
    password = data.get("password", "")

    if len(username) == 0 or len(username) > Config.MAX_USER_NAME:
        return jsonify({"message": "Username too long"}), 400

    if len(password) == 0 or len(password) > Config.MAX_USER_PASSWORD:
        return jsonify({"message": "Password too long"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not pbkdf2_sha256.verify(password, user.password):
        return jsonify({"message": "Invalid username or password"}), 409

    data = {
        "access_token": create_access_token(identity=user.secret),
        "refresh_token": create_refresh_token(identity=user.secret),
    }

    return jsonify(data), 201
