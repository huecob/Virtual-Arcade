"""CRUD Operations"""

from model import db, User, GameSession, Game, connect_to_db
import json

def create_user(email, password, user_display_name):
    """Creates new users"""

    user = User(user_email=email, user_password=password, user_display_name=user_display_name)

    return user

def create_game(game_title,game_description=""):
    """Creates new game"""

    game = Game(game_title=game_title, game_description=game_description)

    return game

def create_session(score,time_played):

    session = GameSession(score=score, time_played=time_played)

    return session

def get_users():

    return User.query.all()

def get_users_by_id(user_id):

    return User.query.get(user_id)

def get_user_by_email(email):

    return User.query.filter(User.user_email == email).first()

# language filter
def check_bad_word(word): 
    """Language check"""

    f = open('lang.json')
    data = json.load(f)
    if word in data["words"]:
        return True
    else:
        return False

if __name__ == "__main__":
    from server import app
    app.app_context().push()
    connect_to_db(app)