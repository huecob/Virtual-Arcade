"""Main Server!! Woohoo!"""

from flask import (Flask, render_template, request, flash, get_flashed_messages, session, redirect)
from model import connect_to_db, db
import crud

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
        flash("Sorry yo! something's up with your login info. :P")
    else:
        flash("Welcome back friend!")
        session['email'] = user.user_email
    
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

    if not crud.get_user_by_email(email):
        flash("Saddle up, Player!")
        user = crud.create_user(email,password, display_name)
        db.session.add(user)
        db.session.commit()

    else:
        flash("Multiverse Error: There's someone else with the email. 🤪")

    return redirect('/')

@app.route('/player-profile')
def show_profile():

    user = crud.get

    return render_template('player-profile.html')




if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)