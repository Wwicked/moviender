from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Config:
    MAX_USER_SECRET = 50
    MAX_USER_NAME = 50
    MAX_USER_PASSWORD = 150  # Bigger to store the hash


class Base(db.Model):
    __abstract__ = True

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    secret = db.Column(db.String(Config.MAX_USER_SECRET), unique=True)
    username = db.Column(db.String(Config.MAX_USER_NAME))
    password = db.Column(db.String(Config.MAX_USER_PASSWORD))
