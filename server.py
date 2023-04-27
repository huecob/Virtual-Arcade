"""Main Server!! Woohoo!"""

from flask import (Flask, render_template, request, flash, get_flashed_messages, session, redirect,jsonify)
from model import connect_to_db, db
import crud
import json

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def show_homepage():
    """Landing page"""

    if 'email' not in session:
        return render_template('homepage.html')
    else:
        user = crud.get_user_by_email(session['email'])
        return render_template('homepage.html',user=user)

@app.route('/login', methods=["POST"])
def login_user():
    """This logs the user in"""

    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)

    if user.user_email != email or user.user_password != password:
        flash("Sorry yo! Something's up with your login info. :P")
    else:
        flash("Welcome back friend!")
        session['email'] = user.user_email
        session['user_id'] = user.user_id
    
    return redirect('/')

@app.route('/registration')
def show_registration():
    """Displays the registration page"""

    return render_template('registration.html')

@app.route('/register-user', methods = ['POST'])
def create_user():
    """Registers a user, shoots them to the DB"""

    email = request.form.get("email")
    password = request.form.get("password")
    display_name = request.form.get("display name")

    if crud.check_bad_word(display_name) == False:
        if not crud.get_user_by_email(email):
         flash("Saddle up, Player!")
         user = crud.create_user(email,password, display_name)
        db.session.add(user)
        db.session.commit()

        # you need to add in session key value

        return redirect('/')

    elif crud.check_bad_word(display_name) == True:
        flash("Please keep the language clean!!")
    
    elif crud.get_user_by_email(email):
        flash("Multiverse Error: There's someone else with the email. 🤪")

    return redirect('/registration')
    

@app.route('/player-profile/<user_id>')
def show_profile(user_id):
    """Loads Player Profile"""

    user = crud.get_users_by_id(user_id)

    return render_template('player-profile.html', user=user)

@app.route('/update-display-name', methods=['POST'])
def update_name():
    """Updates display name"""

    user_id = request.json['user_id']
    user_id = int(user_id)

    newName = request.json['updated_name']

    crud.update_display_name(user_id, newName)

    return jsonify({"code": "Success",
                    "name": newName})


@app.route('/game-1')
def play_game():
    """This will be where your game will live"""

    return render_template('game-page.html')

@app.route('/logout')
def logout_user():
    """handles the logout"""

    session.pop('email', None)
    session.pop('user_id', None)

    flash("Thanks for playing!")

    return redirect('/')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)