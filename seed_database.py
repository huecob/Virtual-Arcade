"""Script to seed database."""

import os
from model import connect_to_db
from server import app
from datetime import datetime, timedelta
import crud
import model 
import server
import random

os.system('dropdb games')
os.system('createdb games')

model.connect_to_db(server.app)
app.app_context().push()
model.db.create_all()

# user dummies

for n in range(10):
    email = f"user{n}@test.com"
    password = "test"

    display_name = f"test{n}"

    user = crud.create_user(email,password,display_name)

    model.db.session.add(user)

model.db.session.commit()

# make users, make games then session/ difficulties (need those IDs before further uploads of data)
for g in range(10):

    game_title = f"test {g} data"

    game_description = f"test {g} data"

    game = crud.create_game(game_title, game_description)

    model.db.session.add(game)
model.db.session.commit()


dates = []
for i in range(10):
    year = 2023
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    date = datetime(year, month, day, hour, minute, second)
    dates.append(date)

for i in range(10):

    date=dates[i].strftime('%Y-%m-%d %H:%M:S')

    user_id = random.randint(1,10)

    game_id = random.randint(1,5)

    score = random.randint(0, 6000)

    time_played = random.randint(100, 3000)

    session = crud.create_session(date, user_id, game_id, score, time_played)

    model.db.session.add(session)
model.db.session.commit()

for q in range(1,5):

    description = ""

    difficulty_description = f"{q} test"
    
    if q == 1:
        description = "Easy"
    elif q == 2:
        description = "Medium"
    elif q == 3:
        description = "Hard"
    elif q == 4:
        description = "Expert"

    difficulties = crud.create_difficulties(q, description)

    model.db.session.add(difficulties)
model.db.session.commit()

for o in range(1,11):

    game_difficulty_id = o

    game_id = random.randint(1,5)

    game_difficulty = random.randint(1,9)

    create_difficulty = crud.create_game_difficulty(game_difficulty_id, game_id, game_difficulty)

    model.db.session.add(game_difficulty)
model.db.session.commit()

if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    app.app_context().push()