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
api_manager.create_api(Sport, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Facility, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasSport, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasTeam, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(FacilityHasSport, methods=['GET', 'POST', 'DELETE', 'PUT'])


@app.route('/')
def index():
    return app.send_static_file("index.html")


@app.route('/api/sign_in', methods=['POST'])
def sign_in():
    # Get User table
    from Unchained import User

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter(User.email == email).all()

    if user:
        if password == user[0].password:
            return str(user[0].id)
        else:
            return "Password Incorrect"
    else:
        return "No User with that email"


@app.route('/api/get_team_by_url', methods=['POST'])
def get_team_by_url():
    from Unchained import Team

    data = request.get_json()
    url = data.get('url')
    password = data.get('password')
    team = Team.query.filter(Team.url == url).all()

    if team:
        if password == team[0].password:
            return str(team[0].id)
        else:
            return "Password Incorrect"
    else:
        return "No Workspace with that name"


@app.route('/api/email_check', methods=['POST'])
def email_check():
    from Unchained import User

    data = request.get_json()
    email = data.get('email')
    user = User.query.filter(User.email == email).all()

    if user:
        return "duplicate"
    else:
        return "noduplicate"


@app.route('/api/team_url_check', methods=['POST'])
def team_url_check():
    from Unchained import Team

    data = request.get_json()
    url = data.get('url')
    team = Team.query.filter(Team.url == url).all()

    if team:
        return "duplicate"
    else:
        return "noduplicate"


@app.route('/api/send_mail', methods=['POST'])
def send_mail():
    import smtplib

    data = request.get_json()

    user = data.get('user')
    receivers = data.get('email')
    team = data.get('team')
    password = data.get('password')
    sender = 'mycodebrary@gmail.com'

    message = """\From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (sender, receivers, "Unchained Invitation from " + user,
           "You have recieved an invitation to join " + user + "'s Team " + team + " with password " + password + " \n Go to www.unchained.com make an account and join their workspace")

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls()
    server.login("mycodebrary@gmail.com", "mycodebrary#1")
    server.sendmail(sender, receivers, message)
    server.close()

    return "Successfully sent"


@app.route('/api/get_team_members', methods=['POST'])
def get_team_members():
    import json
    import collections
    from Unchained import User

    data = request.get_json()
    team_id = data.get('team_id')

    users = User.query.filter(User.team_id == team_id).all()
    objects_list = []

    for user in users:
        d = collections.OrderedDict()
        d['id'] = user.id
        d['team_id'] = user.team_id
        d['first_name'] = user.first_name
        d['last_name'] = user.last_name
        d['description'] = user.description
        d['email'] = user.email
        d['picture'] = user.picture

        objects_list.append(d)

    j = json.dumps(objects_list)
    return j


@app.route('/api/get_user_sports', methods=['POST'])
def get_user_sports():
    import json
    import collections
    from Unchained import UserHasSport
    from Unchained import Sport

    data = request.get_json()
    user_id = data.get('user_id')

    sport_ids = UserHasSport.query.filter(UserHasSport.user_id == user_id).all()
    objects_list = []

    if sport_ids:

        for sid in sport_ids:
            sport = Sport.query.get(sid.sport_id)

            d = collections.OrderedDict()
            d['id'] = sport.id
            d['number_of_members'] = sport.number_of_members
            d['number_of_teams'] = sport.number_of_teams
            d['name'] = sport.name
            d['draw_flag'] = sport.draw_flag

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no sports"


@app.route('/api/get_user_teams', methods=['POST'])
def get_user_teams():
    import json
    import collections
    from Unchained import UserHasTeam
    from Unchained import Team

    data = request.get_json()
    user_id = data.get('user_id')

    user_has_teams = UserHasTeam.query.filter(UserHasTeam.user_id == user_id).all()
    objects_list = []

    if user_has_teams:

        for uht in user_has_teams:
            team = Team.query.get(uht.team_id)

            d = collections.OrderedDict()
            d['id'] = team.id
            d['sport_id'] = team.sport_id
            d['picture'] = team.picture
            d['adminId'] = team.adminId
            d['name'] = team.name
            d['url'] = team.url
            d['description'] = team.description
            d['password'] = team.password

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no teams"

app.debug = True

if __name__ == '__main__':
    app.run()
