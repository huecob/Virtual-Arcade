"""CRUD Operations"""

from model import db, User, GameSession, Game, connect_to_db
from datetime import datetime, timedelta
from sqlalchemy import and_
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
    """Start a session"""

    session = GameSession(score=score, time_played=time_played)

    return session

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

    retval = []

    last_week = datetime.now() - timedelta(days=7)

    sessions = GameSession.query.filter(
        and_(
            GameSession.user_id == user_id,
            GameSession.session_date >= last_week
        )
    ).order_by(GameSession.session_date).all()

    for session in sessions:
        session_date = session.session_date

        y = str(session_date.year)
        mo = session_date.strftime('%B')
        day = str(session_date.day)

        session_date = f"{mo} {day}, {y}"

        score = session.score
        retval.append({'session_date': session_date, 'score': score})

    return retval #this is all the user session_data

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