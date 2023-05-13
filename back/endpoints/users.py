from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Movie, db, Genre, Config
from json import loads

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


@users_blueprint.route("/<int:user_id>/likes", methods=["GET"])
@jwt_required()
def get_likes(user_id):
    user = User.query.get_or_404(user_id)
    ids = [movie.id for movie in user.liked_movies]
    return jsonify(ids), 200


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


@users_blueprint.route("<int:user_id>/settings", methods=["POST"])
@jwt_required()
def update_settings(user_id):
    user = User.query.get_or_404(user_id)
    data = request.form.to_dict()

    names = loads(data.get("excluded_genres", []))
    genres = Genre.query.filter(Genre.name.in_(names)).all()
    if genres:
        user.excluded_genres = genres
        db.session.commit()

    year_from = int(data.get("year_from", -1))
    if year_from != -1 and year_from >= Config.MIN_YEAR_FROM:
        user.year_from = year_from
        db.session.commit()

    year_to = int(data.get("year_to", -1))
    if year_to != -1 and year_to <= Config.MAX_YEAR_TO:
        user.year_to = year_to
        db.session.commit()

    return jsonify(user.to_dict()), 200
