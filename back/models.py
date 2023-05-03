from flask_sqlalchemy import SQLAlchemy

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


class User(Base):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean())
    token = db.Column(db.String(Config.MAX_USER_TOKEN), unique=True)
    username = db.Column(db.String(Config.MAX_USER_NAME), nullable=False, unique=True)
    password = db.Column(db.String(Config.MAX_USER_PASSWORD), nullable=False)
    joined = db.Column(db.Integer, nullable=False)


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


class FunFact(Base):
    __tablename__ = "fun_facts"

    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(Config.MAX_FUN_FACT_HEADER), nullable=False)
    content = db.Column(db.String(Config.MAX_FUN_FACT_CONTENT), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movies.id"), nullable=False)

    movie = db.relationship("Movie", back_populates="fun_facts")


movie_genre = db.Table(
    "movie_genre",
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
    db.Column("genre_id", db.Integer, db.ForeignKey("genres.id"), primary_key=True),
)
