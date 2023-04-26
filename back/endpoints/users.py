from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/", methods=["GET"])
@jwt_required()
def get_user():
    user = User.query.filter_by(token=get_jwt_identity()).first_or_404()
    res = user.to_dict()

    res.pop("token")
    res.pop("password")

    return jsonify(res), 200


@users_blueprint.route("/<int:user_id>/likes", methods=["POST"])
@jwt_required()
def add_like(user_id):
    user = User.query.get(user_id)
    data = request.form.to_dict()
    movie_id = data.get("movie_id")

    print(f"Like! User id: {user.id} Movie id: {movie_id}")

    return jsonify({"message": "Success"}), 200


@users_blueprint.route("/<int:user_id>/dislikes", methods=["POST"])
@jwt_required()
def add_dislike(user_id):
    user = User.query.get(user_id)
    data = request.form.to_dict()
    movie_id = data.get("movie_id")

    print(f"Dislike! User id: {user.id} Movie id: {movie_id}")

    return jsonify({"message": "Success"}), 200


@users_blueprint.route("/<int:user_id>/watch-later", methods=["POST"])
@jwt_required()
def add_watch_later(user_id):
    user = User.query.get(user_id)
    data = request.form.to_dict()
    movie_id = data.get("movie_id")

    print(f"Watch later! User id: {user.id} Movie id: {movie_id}")

    return jsonify({"message": "Success"}), 200
