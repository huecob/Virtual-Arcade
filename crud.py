"""CRUD Operations"""

from model import db, User, GameSession, Game, GameDifficulty, Difficulties, connect_to_db
from datetime import datetime, timedelta, date
from sqlalchemy import (and_, func)
# from flask_sqlalchemy import SQLAlchemy
import json

def create_user(email, password, user_display_name):
    """Creates new users"""

    user = User(user_email=email, user_password=password, user_display_name=user_display_name)

    return user

def create_game(game_title,game_description=""):
    """Creates new game"""

    game = Game(game_title=game_title, game_description=game_description)

    return game

def create_session(session_date, user_id, game_id, score, time_played):
    """Start a session"""

    session = GameSession(session_date=session_date, 
                          user_id=user_id, 
                          game_id=game_id, 
                          score=score, 
                          time_played=time_played)

    return session

def create_difficulties(difficulty_level_id, difficulty_description=""):
    """Creates a difficulty"""

    difficulty = Difficulties(difficulty_level_id=difficulty_level_id, 
                              difficulty_description=difficulty_description)

    return difficulty

def create_game_difficulty(game_difficulty_id, game_id, game_difficulty):
    """Creates a game difficulty"""

    game_difficulty = GameDifficulty(game_difficulty_id=game_difficulty_id, 
                                     game_id=game_id, 
                                     game_difficulty=game_difficulty)

    return game_difficulty

def get_users():
    """Show all users"""

    return User.query.all()

def get_users_by_id(user_id):
    """Find users by ID"""

    return User.query.get(user_id)

def get_user_by_email(email):
    """Find users by email"""

    return User.query.filter(User.user_email == email).first()

def update_display_name(user_id, new_name):
    """Update display name"""

    if check_bad_word(new_name) == True:
        raise ValueError("Don't even think about it!")

    user = User.query.get(user_id)

    if user is not None:
        user.user_display_name = new_name

        db.session.commit()

    # you need to apply your language filter here as well.

def get_game_by_id(game_id):
    """Queries for game by ID #"""

    return Game.query.filter(Game.game_id == game_id).first()

def get_user_highest_score(user_id):
    """Finds the user's highest score data"""

    return GameSession.query.filter_by(user_id=user_id).order_by(GameSession.score.desc()).first()

def get_highest_score():
    """Returns the reigning champion's highest score"""

    return GameSession.query.order_by(GameSession.score.desc()).first()

def find_users_like(keyword):
    """Used for keyword search of profiles"""

    return User.query.filter(User.user_display_name.like(f'%{keyword}%')).all()

def seconds_played_ever(user_id):
    """Sumnation of time spent in-game"""

    user = GameSession.query.filter(GameSession.user_id == user_id).all() #this returned all user game sesh data

    retval = 0
    
    for sessions in user:
       retval += sessions.time_played

    return retval

def last_7_days(user_id):
    """Find game session data from the last 7 days"""

    # retval = []

    last_week = date.today() - timedelta(days=7)
    date_gap = date.today() + timedelta(days=4)

    sessions = GameSession.query.filter(
        and_(
            GameSession.user_id == user_id,
            GameSession.session_date >= last_week,
            GameSession.session_date <= date_gap
        )
    ).order_by(GameSession.session_date).all()

    retval = [
        {
            'session_date': session.session_date.strftime('%B %d, %Y'),
            'score': session.score,
            'game_id': session.game_id
        }
        for session in sessions
    ]

    return retval #this is all the user session_data


def check_bad_word(word): 
    """Language check"""

    f = open('lang.json')
    data = json.load(f)
    if word in data["words"]:
        return True
    else:
        return False
    
    
def game_specific_user_data(user_id):
    """Returns an dictionary. 
    Keys are game_ids
    Values are a list of dictionaries (game_session data)"""

    retval = {}

    data = last_7_days(user_id)

    for element in data:
        if element['game_id'] not in retval:
            retval[element['game_id']] = [element]
        else:
            retval[element['game_id']].append(element)

    return retval

if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    app.app_context().push()
    

[{'session_date': 'May 12, 2023', 'score': 0, 'game_id': 2}, {'session_date': 'May 12, 2023', 'score': 0, 'game_id': 2}, {'session_date': 'May 14, 2023', 'score': 1400, 'game_id': 2}, {'session_date': 'May 14, 2023', 'score': 600, 'game_id': 2}, {'session_date': 'May 14, 2023', 'score': 1500, 'game_id': 2}, {'session_date': 'May 14, 2023', 'score': 0, 'game_id': 2}, {'session_date': 'May 14, 2023', 'score': 200, 'game_id': 2}, {'session_date': 'July 22, 2023', 'score': 879, 'game_id': 3}, {'session_date': 'August 3, 2023', 'score': 733, 'game_id': 5}]