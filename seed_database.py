"""Script to seed database."""

import os
from model import connect_to_db
import crud
import model 
import server

os.system('dropdb games')
os.system('createdb games')

model.connect_to_db(server.app)
app.app_context().push()
model.db.create_all()

# user dummies

for n in range(10):
    email = f"user{n}@test.com"
    password = "test"

    user = crud.create_user(email,password)

    model.db.session.add(user)

model.db.session.commit()

# make users, make games then session/ difficulties (need those IDs before further uploads of data)