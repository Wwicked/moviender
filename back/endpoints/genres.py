from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from endpoints.auth import admin_required
from models import Genre, db

genres_blueprint = Blueprint("genres", __name__)


@genres_blueprint.route("/new", methods=["POST"])
@jwt_required()
@admin_required
def add_genre():
    if "name" not in request.form:
        return jsonify({"message": "Missing data"}), 400

    data = request.form.to_dict()
    name = data.get("name")

    if not name:
        return jsonify({"message": "Invalid name"}), 400

    genre = Genre.query.filter_by(name=name).first()
    if genre:
        return jsonify({"message": "Genre already exists"}), 200

    genre = Genre(name=name)
    db.session.add(genre)
    db.session.commit()

    return jsonify({"message": "Genre created successfully"}), 200


@genres_blueprint.route("/", methods=["GET"])
def get_genres():
    all_genres = Genre.query.all()
    response = [genre.name for genre in all_genres]

    return jsonify(response), 200
