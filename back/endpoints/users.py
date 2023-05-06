from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Movie, db

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
def like(user_id):
    user = User.query.get_or_404(user_id)
    movie_id = request.form.to_dict().get("movie_id")
    movie = Movie.query.get_or_404(movie_id)

    if movie not in user.liked_movies:
        user.liked_movies.append(movie)

    db.session.commit()

    return jsonify({"message": "Success"}), 200


@users_blueprint.route("/<int:user_id>/dislikes", methods=["POST"])
@jwt_required()
def dislike(user_id):
    user = User.query.get_or_404(user_id)
    movie_id = request.form.to_dict().get("movie_id")
    movie = Movie.query.get_or_404(movie_id)

    if movie not in user.disliked_movies:
        user.disliked_movies.append(movie)

    db.session.commit()

    return jsonify({"message": "Success"}), 200


@users_blueprint.route("/<int:user_id>/watch-later", methods=["POST"])
@jwt_required()
def watch_later(user_id):
    user = User.query.get_or_404(user_id)
    movie_id = request.form.to_dict().get("movie_id")
    movie = Movie.query.get_or_404(movie_id)

    if movie not in user.watch_later_movies:
        user.watch_later_movies.append(movie)

    db.session.commit()

    return jsonify({"message": "Success"}), 200
