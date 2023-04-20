"""Project Data Model"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """Users"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_email = db.Column(db.String, unique=True, nullable=False)
    user_password = db.Column(db.String, nullable=False)
    user_display_name = db.Column(db.String, unique=True, nullable=False)

    user_session = db.relationship("GameSession",back_populates="user")

    def __repr__(self):
        return f"<user_id: {self.user_id}, user_pw: {self.user_password} user_email: {self.user_email} display_name: {self.user_display_name}>"

class GameSession(db.Model):
    """Session & Score Details"""

    __tablename__ = "game_session"

    session_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    session_date = db.Column(db.DateTime, default = datetime.now())
# will auto incrementing a date 'work'? DateTime mod in py to get datetime.now() <-- look this up
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    game_id = db.Column(db.Integer, db.ForeignKey("games.game_id"))
    score = db.Column(db.Integer)
    time_played = db.Column(db.Interval) 
# will I need to consider some sort of timer? How to track seconds or minutes? Needs syntax for this

    user = db.relationship("User", back_populates="user_session")
    game = db.relationship("Game", back_populates="game_session")

    def __repr__(self):
        return f"<Session ID: {self.session_id} User: {self.user_id} Score: {self.score}>"
    

# genre
class Difficulties(db.Model):
    """Difficulty assoc. table"""

    __tablename__ = "difficulties"

    difficulty_level_id = db.Column(db.Integer, autoincrement=True, primary_key=True, unique=True)
    difficulty_description = db.Column(db.String(100))

    games = db.relationship("Game",secondary="game_difficulties", back_populates="difficulties")

    def __repr__(self):
        return f"<Difficulty Level: {self.difficulty_level_id} Description: {self.difficulty_description}>"
    
# this is the book
class Game(db.Model):
    """Game Information"""

    __tablename__ = "games"

    game_id = db.Column(db.Integer, autoincrement=True, primary_key=True, unique=True)
    game_title = db.Column(db.String, nullable=False)
    game_description = db.Column(db.String)

    game_session = db.relationship("GameSession",back_populates="game")
    difficulties = db.relationship("Difficulties", secondary="game_difficulties", back_populates="games")

    def __repr__(self):
        return f"<Game ID: {self.game_id} Game Title: {self.game_title}>" 
    
# book genre
class GameDifficulty(db.Model):
    """Game Difficulties"""

    __tablename__ = "game_difficulties"

    game_difficulty_id = db.Column(db.Integer,primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey("games.game_id"))
    game_difficulty = db.Column(db.Integer, db.ForeignKey("difficulties.difficulty_level_id"))

    def __repr__(self):
        return f"<Game ID: {self.game_id} Difficulty: {self.game_difficulty}>"
    

def connect_to_db(flask_app, db_uri="postgresql:///games", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)
    print("connected to the db!")
    

if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    app.app_context().push()