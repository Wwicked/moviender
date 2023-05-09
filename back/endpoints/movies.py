from flask import Blueprint, jsonify, request, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from endpoints.auth import admin_required
from models import Config, Movie, Genre, db, CastMember, FunFact, User
from json import loads
from schema import Schema, And, Use, SchemaError
from werkzeug.utils import secure_filename
import os
from time import time
import random

movies_blueprint = Blueprint("movies", __name__)


def check_schema(custom_schema, data):
    try:
        custom_schema.validate(data)
        return True

    except SchemaError:
        return False


def valid_genres(genres):
    for genre in genres:
        obj = Genre.query.filter_by(name=genre).first()

        if not obj:
            return False

    return True


def valid_cast(members):
    cast_schema = Schema(
        {
            "real": And(Use(str)),
            "movie": And(Use(str)),
        }
    )

    return check_schema(Schema([cast_schema]), members)


def valid_fun_facts(facts):
    fun_facts_schema = Schema(
        {
            "header": And(Use(str)),
            "content": And(Use(str)),
        }
    )

    return check_schema(Schema([fun_facts_schema]), facts)


def validate_movie_data(data, images):
    required_fields = [
        "title",
        "description",
        "release",
        "duration",
        "genres",
    ]

    for field in required_fields:
        if not data.get(field):
            return False, f"Missing field {field}"

    title = data.get("title", "")
    if (
        not isinstance(title, str)
        or len(title) < 0
        or len(title) > Config.MAX_MOVIE_TITLE
    ):
        return False, "Invalid title"

    exists = Movie.query.filter_by(title=title).first()
    if exists:
        return False, "Movie with that title already exists"

    description = data.get("description", "")
    if (
        not isinstance(description, str)
        or len(description) < 0
        or len(description) > Config.MAX_MOVIE_DESCRIPTION
    ):
        return False, "Invalid description"

    release = int(data.get("release", 0))
    if not isinstance(release, int) or release < 0:
        return False, "Invalid release"

    duration = int(data.get("duration", 0))
    if not isinstance(duration, int) or duration < 0:
        return False, "Invalid duration"

    video_id = data.get("video_id", "")
    if not isinstance(video_id, str):
        return False, "Invalid video id"

    genres = data.get("genres", [])
    if not isinstance(genres, list) or len(genres) == 0 or not valid_genres(genres):
        return False, "Invalid genres"

    cast = data.get("cast", [])
    if not isinstance(cast, list) or not valid_cast(cast):
        return False, "Invalid cast"

    fun_facts = data.get("fun_facts", [])
    if not isinstance(fun_facts, list) or not valid_fun_facts(fun_facts):
        return False, "Invalid fun facts"

    # Images
    if len(images) == 0:
        return False, "No images provided"

    if len(images) > Config.MAX_IMAGES_NUM:
        return False, "Too many images"

    return True, ""


def save_movie_images(movie, images):
    # Create folder for this specific movie (static/movies/{movie.id})
    movie_folder = os.path.join(
        current_app.static_folder,
        current_app.config["MOVIE_PICTURES_FOLDER"],
        f"{movie.id}",
    )

    if not os.path.exists(movie_folder):
        os.makedirs(movie_folder)

    # Save all the images to that folder
    for index, image in enumerate(images):
        filename = secure_filename(
            f"{index}.{current_app.config['MOVIE_PICTURES_EXTENSION']}"
        )
        target_folder = os.path.join(
            current_app.static_folder,
            current_app.config["MOVIE_PICTURES_FOLDER"],
            f"{movie.id}",
            filename,
        )
        image.save(target_folder)


@movies_blueprint.route("/new", methods=["POST"])
@jwt_required()
@admin_required
def add_movie():
    if "movie" not in request.form:
        return jsonify({"message": "Missing data"}), 400

    if "images[]" not in list(request.files):
        return jsonify({"message": "Missing images"}), 400

    data = loads(request.form["movie"])
    images = request.files.getlist("images[]")
    ok, message = validate_movie_data(data, images)

    if not ok:
        return jsonify({"message": message}), 400

    title = data.get("title")
    description = data.get("description")
    release = data.get("release")
    duration = data.get("duration")
    video_id = data.get("video_id", "")
    genres = data.get("genres", [])
    cast = data.get("cast", [])
    fun_facts = data.get("fun_facts", [])
    genres_objects = [Genre.query.filter_by(name=genre).first() for genre in genres]

    # Create the movie, so we get the id
    movie = Movie(
        title=title,
        description=description,
        release=release,
        duration=duration,
        video_id=video_id,
        added=int(time()),
        genres=[],
        cast=[],
        fun_facts=[],
    )

    db.session.add(movie)
    db.session.commit()
    db.session.refresh(movie)

    cast_objects = []
    for member in cast:
        obj = CastMember(
            real_name=member["real"], character_name=member["movie"], movie_id=movie.id
        )

        db.session.add(obj)
        db.session.commit()
        db.session.refresh(obj)

        cast_objects.append(obj)

    fun_facts_objects = []
    for fact in fun_facts:
        obj = FunFact(
            header=fact["header"],
            content=fact["content"],
            movie_id=movie.id,
        )

        db.session.add(obj)
        db.session.commit()
        db.session.refresh(obj)

        fun_facts_objects.append(obj)

    # Update fields which require id
    movie.genres = genres_objects
    movie.cast = cast_objects
    movie.fun_facts = fun_facts_objects

    db.session.commit()

    save_movie_images(movie, images)

    return jsonify(movie.id), 200


@movies_blueprint.route("/pick", methods=["GET"])
@jwt_required()
def pick():
    user = User.query.filter_by(token=get_jwt_identity()).first_or_404()
    movies = Movie.query.all()

    if not movies:
        return jsonify({"message": "No movies"}), 400

    def not_reacted_yet(movie):
        if movie in user.liked_movies:
            return False

        if movie in user.disliked_movies:
            return False

        if movie in user.watch_later_movies:
            return False

        return True

    movies = list(filter(not_reacted_yet, movies))

    if len(movies) == 0:
        return jsonify({"message": "No movies without a reaction"}), 400

    movie = random.choice(movies)
    data = movie.to_dict()

    return jsonify(data), 200


@movies_blueprint.route("/<int:movie_id>", methods=["GET"])
@jwt_required()
def get(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    return jsonify(movie.to_dict()), 200


@movies_blueprint.route("/<int:movie_id>/images/<path:filename>", methods=["GET"])
def send_movie_image(movie_id, filename):
    directory = os.path.join(
        current_app.static_folder,
        current_app.config["MOVIE_PICTURES_FOLDER"],
        f"{movie_id}",
    )

    if not os.path.exists(os.path.join(directory, filename)):
        return jsonify({"message": "File not found"}), 404

    return send_from_directory(directory, filename)
