from functools import wraps
from uuid import uuid4

from flask import Blueprint, abort, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    verify_jwt_in_request,
)
from models import Config, User, db
from passlib.hash import pbkdf2_sha256
from time import time

auth_blueprint = Blueprint("auth", __name__)


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        user = User.query.filter_by(token=get_jwt_identity()).first_or_404()

        if not user.is_admin:
            abort(403)

        return f(*args, **kwargs)

    return decorated_function


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

    is_first_user = len(User.query.all()) == 0
    user = User(
        token=str(uuid4()),
        username=username,
        password=pbkdf2_sha256.encrypt(password),
        joined=int(time()),
        is_admin=is_first_user,
        excluded_genres=[],
        year_from=Config.MIN_YEAR_FROM,
        year_to=Config.MAX_YEAR_TO,
    )

    db.session.add(user)
    db.session.commit()

    data = {
        "access_token": create_access_token(identity=user.token),
        "refresh_token": create_refresh_token(identity=user.token),
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
        "access_token": create_access_token(identity=user.token),
        "refresh_token": create_refresh_token(identity=user.token),
    }

    return jsonify(data), 200
