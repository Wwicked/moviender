from flask import Blueprint, jsonify
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
