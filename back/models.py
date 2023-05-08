from flask_sqlalchemy import SQLAlchemy
from flask import url_for, current_app
import os

db = SQLAlchemy()


class Config:
    def MB(amt):
        return amt * 1024 * 1024

    MAX_USER_TOKEN = 50
    MAX_USER_NAME = 50
    MAX_USER_PASSWORD = 150

    MAX_MOVIE_TITLE = 100
    MAX_MOVIE_DESCRIPTION = 500
    MAX_MOVIE_VIDEO_ID = 50

    MAX_GENRE_NAME = 30

    MAX_CAST_NAME = 80

    MAX_FUN_FACT_HEADER = 100
    MAX_FUN_FACT_CONTENT = 500

    MAX_IMAGES_NUM = 10
    MAX_IMAGES_SIZE = MB(20)


class Base(db.Model):
    __abstract__ = True

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


movie_genre = db.Table(
    "movie_genre",
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
    db.Column("genre_id", db.Integer, db.ForeignKey("genres.id"), primary_key=True),
)

liked_movies = db.Table(
    "liked_movies",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
)

disliked_movies = db.Table(
    "disliked_movies",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
)

watch_later_movies = db.Table(
    "watch_later_movies",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean())
    token = db.Column(db.String(Config.MAX_USER_TOKEN), unique=True)
    username = db.Column(db.String(Config.MAX_USER_NAME), nullable=False, unique=True)
    password = db.Column(db.String(Config.MAX_USER_PASSWORD), nullable=False)
    joined = db.Column(db.Integer, nullable=False)

    liked_movies = db.relationship("Movie", secondary=liked_movies, backref="liked_by")
    disliked_movies = db.relationship(
        "Movie", secondary=disliked_movies, backref="disliked_by"
    )
    watch_later_movies = db.relationship(
        "Movie", secondary=watch_later_movies, backref="watch_later_by"
    )

    def to_dict(self):
        data = {
            "id": self.id,
            "is_admin": self.is_admin,
            "token": self.token,
            "username": self.username,
            "password": self.password,
            "joined": self.joined,
            "liked_movies": [movie.id for movie in self.liked_movies],
            "disliked_movies": [movie.id for movie in self.disliked_movies],
            "watch_later_movies": [movie.id for movie in self.watch_later_movies],
        }

        return data


class Movie(Base):
    __tablename__ = "movies"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(Config.MAX_MOVIE_TITLE), nullable=False)
    description = db.Column(db.String(Config.MAX_MOVIE_DESCRIPTION), nullable=False)
    release = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    added = db.Column(db.Integer, nullable=False)
    video_id = db.Column(db.String(Config.MAX_MOVIE_VIDEO_ID), nullable=True)

    genres = db.relationship("Genre", secondary="movie_genre", back_populates="movies")
    cast = db.relationship("CastMember", back_populates="movie")
    fun_facts = db.relationship("FunFact", back_populates="movie")

    def to_dict(self):
        data = super().to_dict()
        data["genres"] = [genre.name for genre in self.genres]
        data["cast"] = [member.to_dict() for member in self.cast]
        data["fun_facts"] = [fact.to_dict() for fact in self.fun_facts]
        data["images"] = []

        images_dir = os.path.join(
            current_app.static_folder,
            current_app.config["MOVIE_PICTURES_FOLDER"],
            f"{self.id}",
        )

        if os.path.exists(images_dir):
            data["images"] = [
                url_for(
                    "movies.send_movie_image",
                    movie_id=self.id,
                    filename=filename,
                    _external=True,
                )
                for filename in os.listdir(images_dir)
                if filename.endswith(current_app.config["MOVIE_PICTURES_EXTENSION"])
            ]

        return data


class Genre(Base):
    __tablename__ = "genres"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(Config.MAX_GENRE_NAME), unique=True, nullable=False)

    movies = db.relationship("Movie", secondary="movie_genre", back_populates="genres")


class CastMember(Base):
    __tablename__ = "cast_members"

    id = db.Column(db.Integer, primary_key=True)
    real_name = db.Column(db.String(Config.MAX_CAST_NAME), nullable=False)
    character_name = db.Column(db.String(Config.MAX_CAST_NAME), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"), nullable=False)

    movie = db.relationship("Movie", back_populates="cast")

    def to_dict(self):
        data = {
            "real": self.real_name,
            "movie": self.character_name,
        }

        return data


class FunFact(Base):
    __tablename__ = "fun_facts"

    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(Config.MAX_FUN_FACT_HEADER), nullable=False)
    content = db.Column(db.String(Config.MAX_FUN_FACT_CONTENT), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"), nullable=False)

    movie = db.relationship("Movie", back_populates="fun_facts")

    def to_dict(self):
        data = {
            "header": self.header,
            "content": self.content,
        }

        return data
