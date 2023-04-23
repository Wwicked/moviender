from flask import Blueprint, request, jsonify

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    return jsonify({"message": f"Input id:{id}"})
