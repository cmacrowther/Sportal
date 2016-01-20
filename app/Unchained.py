from flask import Flask, request
from flask.ext.restless import APIManager
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import *

app = Flask(__name__, static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///unchained.db'

db = SQLAlchemy(app)

SQLALCHEMY_TRACK_MODIFICATIONS = True


class User(db.Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, unique=False)
    first_name = Column(Text, unique=False)
    last_name = Column(Text, unique=False)
    email = Column(Text, unique=False)
    password = Column(Text, unique=False)
    description = Column(Text, unique=False)
    picture = Column(Text, unique=False)


class UserHasTeam(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    team_id = Column(Integer, unique=False)


class Team(db.Model):
    id = Column(Integer, primary_key=True)
    sport_id = Column(Integer, unique=False)
    picture = Column(Text, unique=False)
    adminId = Column(Integer, unique=False)
    name = Column(Text, unique=False)
    url = Column(Text, unique=False)
    description = Column(Text, unique=False)
    password = Column(Text, unique=False)


class UserHasSport(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    sport_id = Column(Integer, unique=False)


class Sport(db.Model):
    id = Column(Integer, primary_key=True)
    number_of_members = Column(Integer, unique=False)
    number_of_teams = Column(Integer, unique=False)
    name = Column(Text, unique=False)
    draw_flag = Column(Integer, unique=False)


class Facility(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=False)
    address = Column(Text, unique=False)


class FacilityHasSport(db.Model):
    id = Column(Integer, primary_key=True)
    facility_id = Column(Integer, unique=False)
    sport_id = Column(Integer, unique=False)


db.create_all()

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(User, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Team, methods=['GET', 'POST', 'DELETE', 'PUT'])


@app.route('/')
def index():
    return app.send_static_file("index.html")


if __name__ == '__main__':
    app.run()
