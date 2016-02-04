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
    skill = Column(Text, unique=False)


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


@app.route('/api/join_team', methods=['POST'])
def join_team():
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
        return "No Team with that name"


@app.route('/api/get_team_id_by_url', methods=['GET'])
def get_team_id_by_url(team_url):
    from Unchained import Team

    team = Team.query.filter(Team.url == team_url).all()

    if team:
        return str(team[0].id)
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
    import email.message
    
    data = request.get_json()
    
    user = data.get('user')
    receivers = data.get('email')
    team = data.get('team')
    password = data.get('password')
    sender = 'mycodebrary@gmail.com'
    
    msg = email.message.Message()
    msg['Subject'] = 'Unchained Invitation from' + user
    msg['From'] = 'mycodebrary@gmail.com'
    msg['To'] = receivers
    msg.add_header('Content-Type','text/html')
    msg.set_payload('<h1>You have recieved an invitation to join ' + user + '\'s Team ' + team + ' with password ' + password + ' <br><br> Go to www.unchained.com make an account and join their team!</h1>')

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login("mycodebrary@gmail.com", "mycodebrary#1")
    s.sendmail(msg['From'], [msg['To']], msg.as_string())
               
    return "Successfully sent"



@app.route('/api/get_team_members', methods=['POST'])
def get_team_members():
    import json
    import collections
    from Unchained import UserHasTeam
    from Unchained import User

    data = request.get_json()
    team_id = data.get('team_id')

    members = UserHasTeam.query.filter(UserHasTeam.team_id == team_id).all()
    objects_list = []

    for uht in members:
        user = User.query.get(uht.user_id)
        
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
            d['skill'] = sid.skill

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no sports"


@app.route("/profile/<int:profile_id>", methods=["GET"])
def get_profile(profile_id):
    from Unchained import User
    import json
    import collections

    user = User.query.get(profile_id)
    objects_list = []

    if user:
        d = collections.OrderedDict()
        d['id'] = user.id
        d['team_id'] = user.team_id
        d['first_name'] = user.first_name
        d['last_name'] = user.last_name
        d['description'] = user.description
        d['email'] = user.email
        d['picture'] = user.picture

        objects_list.append(d)
    else:
        return "No User"

    j = json.dumps(objects_list)
    return j


@app.route("/team/<string:team_url>", methods=["GET"])
def get_team(team_url):
    from Unchained import Team
    import json
    import collections

    team_id = get_team_id_by_url(team_url)
    team = Team.query.get(team_id)
    objects_list = []

    if team:
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
    else:
        return "No Team"

    j = json.dumps(objects_list)
    return j


@app.route('/api/get_user_has_sport_id', methods=['POST'])
def get_user_has_sport_id():
    from Unchained import UserHasSport

    data = request.get_json()
    user_id = data.get('user_id')
    sport_id = data.get('sport_id')

    user_has_sport_id = UserHasSport.query.filter(
        and_(UserHasSport.user_id == user_id, UserHasSport.sport_id == sport_id)).all()

    return str(user_has_sport_id[0].id)


@app.route('/api/get_user_has_sport', methods=['POST'])
def get_user_has_sport():
    import json
    import collections
    from Unchained import UserHasSport

    data = request.get_json()
    user_id = data.get('user_id')
    sport_id = data.get('sport_id')

    user_has_sport = UserHasSport.query.filter(
        and_(UserHasSport.user_id == user_id, UserHasSport.sport_id == sport_id)).all()
    objects_list = []

    if user_has_sport:

        for uhs in user_has_sport:
            d = collections.OrderedDict()
            d['id'] = uhs.id
            d['user_id'] = uhs.user_id
            d['sport_id'] = uhs.sport_id
            d['skill'] = uhs.skill

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no user has sport"


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

@app.route('/api/get_team_info', methods=['POST'])
def get_team_info():
    import json
    import collections
    from Unchained import Team
    
    data = request.get_json()
    url = data.get('url')
    item = Team.query.filter(Team.url == url).all()
    objects_list = []
    
    if item:
        
        for group in item:
            team = Team.query.get(group.id)
            
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
        return "it fucked up"

@app.route('/api/team_member_check', methods=['POST'])
def team_member_check():
    import json
    import collections
    from Unchained import Team
    from Unchained import UserHasTeam
    
    data = request.get_json()
    url = data.get('url')
    user_id = data.get('user_id')
    
    team_match = Team.query.filter(Team.url == url).all()
    match = UserHasTeam.query.filter(and_(UserHasTeam.team_id == team_match[0].id, UserHasTeam.user_id == user_id)).all()
        
    if match:
        return "duplicate"
    else:
        return str(team_match[0].id)

@app.route('/api/team_search', methods=['POST'])
def team_search():
    import json
    import collections
    from Unchained import Team
    
    data = request.get_json()
    searchTerm = '%' + str(data.get('searchTerm')) + '%'
    team = Team.query.filter(or_(Team.name.ilike(searchTerm), Team.url.ilike(searchTerm))).all()
    objects_list = []
    
    if team:
        for item in team:
            match = Team.query.get(item.id)
            
            d = collections.OrderedDict()
            d['team_id'] = match.id
            d['name'] = match.name
            d['url'] = match.url
            d['picture'] = match.picture
            d['sport_id'] = match.sport_id
            
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j
    else:
        return "no matching teams"


@app.route('/api/user_search', methods=['POST'])
def user_search():
    import json
    import collections
    from Unchained import User
    
    data = request.get_json()
    searchTerm = '%' + str(data.get('searchTerm')) + '%'
    user = User.query.filter(or_(User.first_name.ilike(searchTerm), User.last_name.ilike(searchTerm), User.email.ilike(searchTerm))).all()
    objects_list = []

    if user:
        for item in user:
            match = User.query.get(item.id)
    
            d = collections.OrderedDict()
            d['id'] = match.id
            d['email'] = match.email
            d['first_name'] = match.first_name
            d['last_name'] = match.last_name
            d['picture'] = match.picture
            
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j
    else:
        return "no matching users"



app.debug = True

if __name__ == '__main__':
    app.run()
