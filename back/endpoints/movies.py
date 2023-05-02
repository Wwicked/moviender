from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from endpoints.auth import admin_required
from models import Config
from json import loads
from schema import Schema, And, Use, SchemaError

movies_blueprint = Blueprint("movies", __name__)


def check_schema(custom_schema, data):
    try:
        custom_schema.validate(data)
        return True

    except SchemaError:
        return False


# TODO: implement
def valid_genres(genres):
    return True


# TODO: implement
def valid_cast(members):
    cast_schema = Schema(
        {
            "real": And(Use(str)),
            "movie": And(Use(str)),
        }
    )

    return check_schema(Schema([cast_schema]), members)


# TODO: implement
def valid_fun_facts(facts):
    fun_facts_schema = Schema(
        {
            "header": And(Use(str)),
            "content": And(Use(str)),
        }
    )

    return check_schema(Schema([fun_facts_schema]), facts)


def validate_movie_data(data):
    current_app.logger.info(data)

    required_fields = [
        "title",
        "description",
        "release",
        "duration",
        "genres",
        "images",
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

    return True, ""


@movies_blueprint.route("/new", methods=["POST"])
@jwt_required()
@admin_required
def add_movie():
    if "movie" not in request.form:
        return jsonify({"message": "Missing data"}), 400

    data = loads(request.form["movie"])
    ok, message = validate_movie_data(data)

    if not ok:
        return jsonify({"message": message}), 400

    title = data.get("title", "")
    description = data.get("description", "")
    release = data.get("release", 0)
    duration = data.get("duration", 0)
    video_id = data.get("video_id", "")
    genres = data.get("genres", [])
    cast = data.get("cast", [])
    fun_facts = data.get("fun_facts", [])
    images = data.get("images", [])

    return jsonify({"message": f"Reached endpoint with title {title}"}), 200
