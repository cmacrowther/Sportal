from flask import Flask, request
from flask.ext.restless import APIManager
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import *
from pusher import Pusher

app = Flask(__name__, static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///unchained.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

SQLALCHEMY_TRACK_MODIFICATIONS = True

import pusher
pusher_client = pusher.Pusher(
                              app_id='186366',
                              key='56753b214ab2420a7230',
                              secret='a10176f8256201a9f921',
                              ssl=True
                              )


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


class TeamHasAdmin(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    team_id = Column(Integer, unique=False)


class Queue(db.Model):
    id = Column(Integer, primary_key=True)
    sport_id = Column(Integer, unique=False)
    user_id = Column(Integer, unique=False)
    is_team = Column(Integer, unique=False)
    members = Column(Integer, unique=False)
    difficulty = Column(Text, unique=False)


class Match(db.Model):
    id = Column(Integer, primary_key=True)
    sport_id = Column(Integer, unique=False)
    player1_id = Column(Integer, unique=False)
    player2_id = Column(Integer, unique=False)
    is_team = Column(Integer, unique=False)
    date = Column(Text, unique=False)
    time = Column(Text, unique=False)
    facility_id = Column(Integer, unique=False)
    complete = Column(Integer, unique=False)
    winner_id = Column(Integer, unique=False)
    score_1 = Column(Integer, unique=False)
    score_2 = Column(Integer, unique=False)


class Event(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=False)
    date = Column(Text, unique=False)
    time = Column(Text, unique=False)
    location_address = Column(Text, unique=false)
    location_lat = Column(Float, unique=False)
    location_long = Column(Float, unique=False)
    description = Column(Text, unique=False)
    creator = Column(Integer, unique=False)


class EventHasAttendee(db.Model):
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, unique=False)
    user_id = Column(Integer, unique=False)

class Channel(db.Model):
    id = Column(Integer, primary_key=True)
    admin_id = Column(Integer, unique=False)
    name = Column(Text, unique=False)
    description = Column(Text, unique=False)

class Message(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    body = Column(Text, unique=False)
    time = Column(Text, unique=False)

class ChannelHasMessage(db.Model):
    id = Column(Integer, primary_key=True)
    channel_id = Column(Integer, unique=False)
    message_id = Column(Integer, unique=False)

class Conversation(db.Model):
    id = Column(Integer, primary_key=True)
    user_one = Column(Integer, unique=False)
    user_two = Column(Integer, unique=False)
    time = Column(Text, unique=False)
    status = Column(Integer, unique=False)

class UserHasChannel(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    channel_id = Column(Integer, unique=False)
    status = Column(Integer, unique=False)

class UserHasMessage(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    message_id = Column(Integer, unique=False)
    is_read_user_one = Column(Integer, unique=False)
    conversation_id = Column(Integer, unique=False)
    is_read_user_two = Column(Integer, unique=False)

class TeamHasChannel(db.Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, unique=False)
    channel_id = Column(Integer, unique=False)

class UserHasNotification(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=False)
    notification = Column(Text, unique=false)
    time = Column(Text, unique=False)
    link = Column(Text, unique=false)
    is_read = Column(Integer, unique=False)

class TeamHasNotification(db.Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, unique=False)
    notification = Column(Text, unique=false)
    time = Column(Text, unique=False)
    link = Column(Text, unique=false)
    is_read = Column(Integer, unique=False)

class Items(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=false)

db.create_all()

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(User, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Team, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Sport, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Facility, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasSport, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasTeam, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(FacilityHasSport, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(TeamHasAdmin, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Queue, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Match, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Event, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(EventHasAttendee, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Channel, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Message, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(ChannelHasMessage, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Conversation, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasChannel, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasMessage, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(TeamHasChannel, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(UserHasNotification, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(TeamHasNotification, methods=['GET', 'POST', 'DELETE', 'PUT'])
api_manager.create_api(Items, methods=['GET', 'POST', 'DELETE', 'PUT'])



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


@app.route('/api/team_name_check', methods=['POST'])
def team_name_check():
    from Unchained import Team

    data = request.get_json()
    name = data.get('name')
    team = Team.query.filter(Team.name == name).all()

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
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(
        '<h1>You have recieved an invitation to join ' + user + '\'s Team ' + team + ' with password ' + password + ' <br><br> Go to www.unchained.com make an account and join their team!</h1>')

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login("mycodebrary@gmail.com", "mycodebrary#1")
    s.sendmail(msg['From'], [msg['To']], msg.as_string())

    return "Successfully sent"


@app.route('/api/send_mail_match', methods=['POST'])
def send_mail_match():
    import smtplib
    import email.message

    data = request.get_json()

    user = data.get('user')
    receivers = data.get('email')
    sender = 'mycodebrary@gmail.com'

    msg = email.message.Message()
    msg['Subject'] = 'Unchained Invitation from' + user
    msg['From'] = 'mycodebrary@gmail.com'
    msg['To'] = receivers
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(
        '<h1>You have a possible match with ' + user + '<br><br> Go to www.unchained.com to accept the match against them!</h1>')

    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login("mycodebrary@gmail.com", "mycodebrary#1")
    s.sendmail(msg['From'], [msg['To']], msg.as_string())

    return "Successfully sent"


@app.route('/api/send_mail_accepted', methods=['POST'])
def send_mail_accepted():
    import smtplib
    import email.message

    data = request.get_json()

    user = data.get('user')
    receivers = data.get('email')
    sender = 'mycodebrary@gmail.com'

    msg = email.message.Message()
    msg['Subject'] = 'You have matched!'
    msg['From'] = 'mycodebrary@gmail.com'
    msg['To'] = receivers
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(
        '<h1>You have a match! Go to www.unchained.com to talk to them!</h1>')

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


@app.route('/api/get_team_members_for_deletion', methods=['POST'])
def get_team_members_for_deletion():
    import json
    import collections
    from Unchained import UserHasTeam

    data = request.get_json()
    team_id = data.get('team_id')
    users = UserHasTeam.query.filter(UserHasTeam.team_id == team_id).all()
    objects_list = []

    if users:
        for item in users:
            d = collections.OrderedDict()
            d['id'] = item.id

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j
    else:
        return "error"


@app.route('/api/get_team_admins_for_deletion', methods=['POST'])
def get_team_admins_for_deletion():
    import json
    import collections
    from Unchained import TeamHasAdmin

    data = request.get_json()
    team_id = data.get('team_id')
    users = TeamHasAdmin.query.filter(TeamHasAdmin.team_id == team_id).all()
    objects_list = []

    if users:
        for item in users:
            d = collections.OrderedDict()
            d['id'] = item.id

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j
    else:
        return "error"


@app.route('/api/get_team_admins', methods=['POST'])
def get_team_admins():
    import json
    import collections
    from Unchained import TeamHasAdmin
    from Unchained import User

    data = request.get_json()
    team_id = data.get('team_id')

    admins = TeamHasAdmin.query.filter(TeamHasAdmin.team_id == team_id).all()
    objects_list = []

    for tha in admins:
        user = User.query.get(tha.user_id)

        d = collections.OrderedDict()
        d['id'] = user.id
        d['first_name'] = user.first_name
        d['last_name'] = user.last_name
        d['email'] = user.email
        d['picture'] = user.picture

        objects_list.append(d)

    j = json.dumps(objects_list)
    return j


@app.route('/api/get_admin', methods=['POST'])
def get_admin():
    import json
    import collections
    from Unchained import TeamHasAdmin

    data = request.get_json()
    team_id = data.get('team_id')
    user_id = data.get('user_id')

    admin = TeamHasAdmin.query.filter(and_(TeamHasAdmin.team_id == team_id, TeamHasAdmin.user_id == user_id)).all()
    objects_list = []

    for tha in admin:
        d = collections.OrderedDict()
        d['id'] = tha.id
        d['user_id'] = tha.user_id
        d['team_id'] = tha.team_id

        objects_list.append(d)

    j = json.dumps(objects_list)
    return j


@app.route('/api/get_member', methods=['POST'])
def get_member():
    import json
    import collections
    from Unchained import UserHasTeam

    data = request.get_json()
    team_id = data.get('team_id')
    user_id = data.get('user_id')

    member = UserHasTeam.query.filter(and_(UserHasTeam.team_id == team_id, UserHasTeam.user_id == user_id)).all()
    objects_list = []

    for uht in member:
        d = collections.OrderedDict()
        d['id'] = uht.id
        d['user_id'] = uht.user_id
        d['team_id'] = uht.team_id

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


@app.route('/api/get_event_attendees', methods=['POST'])
def get_event_attendees():
    import json
    import collections
    from Unchained import User
    from Unchained import EventHasAttendee

    data = request.get_json()
    event_id = data.get('event_id')

    attendees = EventHasAttendee.query.filter(and_(EventHasAttendee.event_id == event_id)).all()
    objects_list = []

    if attendees:

        for item in attendees:
            user = User.query.get(item.user_id)

            d = collections.OrderedDict()
            d['id'] = user.id
            d['first_name'] = user.first_name
            d['last_name'] = user.last_name
            d['description'] = user.description
            d['email'] = user.email
            d['picture'] = user.picture

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no people attending"


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


@app.route('/api/get_user_events', methods=['POST'])
def get_user_events():
    import json
    import collections
    from Unchained import EventHasAttendee
    from Unchained import Event

    data = request.get_json()
    user_id = data.get('user_id')

    event = EventHasAttendee.query.filter(EventHasAttendee.user_id == user_id).all()
    objects_list = []

    if event:

        for item in event:
            match = Event.query.get(item.event_id)

            d = collections.OrderedDict()
            d['id'] = match.id
            d['name'] = match.name
            d['date'] = match.date
            d['time'] = match.time
            d['address'] = match.location_address
            d['latitude'] = match.location_lat
            d['longitude'] = match.location_long
            d['description'] = match.description
            d['creator'] = match.creator

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no events"


@app.route('/api/check_follow_status', methods=['POST'])
def check_follow_status():
    import json
    from Unchained import EventHasAttendee

    data = request.get_json()
    event_id = data.get('event_id')
    user_id = data.get('user_id')

    duplicate = EventHasAttendee.query.filter(
        and_(EventHasAttendee.user_id == user_id, EventHasAttendee.event_id == event_id)).all()

    if duplicate:
        return "duplicate"
    else:
        return "noduplicate"


@app.route('/api/get_event_info', methods=['POST'])
def get_event_info():
    import json
    import collections
    from Unchained import Event

    data = request.get_json()
    url = data.get('url')
    event = Event.query.filter(Event.name == url).all()
    objects_list = []

    if event:

        for item in event:
            match = Event.query.get(item.id)

            d = collections.OrderedDict()
            d['id'] = match.id
            d['name'] = match.name
            d['date'] = match.date
            d['time'] = match.time
            d['address'] = match.location_address
            d['latitude'] = match.location_lat
            d['longitude'] = match.location_long
            d['description'] = match.description
            d['creator'] = match.creator

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "it fucked up"


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
    match = UserHasTeam.query.filter(
        and_(UserHasTeam.team_id == team_match[0].id, UserHasTeam.user_id == user_id)).all()

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
    user = User.query.filter(
        or_(User.first_name.ilike(searchTerm), User.last_name.ilike(searchTerm), User.email.ilike(searchTerm))).all()
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


@app.route('/api/team_admin_check', methods=['POST'])
def team_admin_check():
    import json
    from Unchained import TeamHasAdmin

    data = request.get_json()
    team = data.get('team_id')
    promotee = data.get('promotee')
    admin = TeamHasAdmin.query.filter(and_(TeamHasAdmin.team_id == team, TeamHasAdmin.user_id == promotee)).all()

    if admin:
        return "already admin"
    else:
        return "promote"


@app.route('/api/events_search', methods=['POST'])
def events_search():
    import json
    import collections
    from Unchained import Event

    data = request.get_json()
    searchTerm = '%' + str(data.get('searchTerm')) + '%'
    event = Event.query.filter(
        or_(Event.name.ilike(searchTerm), Event.description.ilike(searchTerm), Event.location.ilike(searchTerm))).all()
    objects_list = []

    if event:
        for item in event:
            match = Event.query.get(item.id)

            d = collections.OrderedDict()
            d['id'] = match.id
            d['name'] = match.name
            d['date'] = match.date
            d['time'] = match.time
            d['address'] = match.location_address
            d['latitude'] = match.location_lat
            d['longitude'] = match.location_long
            d['description'] = match.description
            d['creator'] = match.creator

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j
    else:
        return "no matching events"


@app.route('/api/get_matches_pending', methods=['POST'])
def get_matches_pending():
    import json
    import collections
    from Unchained import Match
    from Unchained import User
    from Unchained import Sport

    data = request.get_json()
    user_id = data.get('user_id')
    page = data.get('page')

    if page == 1:
        pending = Match.query.filter(and_(Match.player1_id == user_id, Match.complete == 2)).all()

    if page == 0:
        pending = Match.query.filter(and_(Match.player2_id == user_id, Match.complete == 2)).all()

    if page == 3:
        pending = Match.query.filter(and_(Match.player2_id == user_id, Match.complete == 0)).all()

    objects_list = []

    for item in pending:
        user = User.query.get(item.player2_id)
        opponent = User.query.get(item.player1_id)
        sport = Sport.query.get(item.sport_id)

        d = collections.OrderedDict()
        d['id'] = user.id
        d['sport_name'] = sport.name
        d['opponent'] = opponent.first_name + " " + opponent.last_name
        d['first_name'] = user.first_name
        d['last_name'] = user.last_name
        d['email'] = user.email
        d['picture'] = user.picture

        objects_list.append(d)

    j = json.dumps(objects_list)
    return j


# MATCHMAKING
@app.route('/api/single_matchmaking', methods=['POST'])
def single_matchmaking():
    import json
    import collections
    from Unchained import Queue
    from Unchained import User

    data = request.get_json()
    sport_id = data.get('sport_id')
    user_id = data.get('user_id')
    difficulty = data.get('difficulty')
    team = data.get('team')

    if team == '1 VS 1':
        is_team = 0
    else:
        is_team = 1

    queue = Queue.query.filter(
        and_(Queue.difficulty == difficulty, Queue.sport_id == sport_id, Queue.is_team == is_team)).all()
    objects_list = []

    if len(queue) >= 5:
        queue1 = queue[:5]

        for item in queue1:
            user = User.query.get(item.user_id)

            d = collections.OrderedDict()
            d['id'] = user.id
            d['first_name'] = user.first_name
            d['last_name'] = user.last_name
            d['email'] = user.email
            d['picture'] = user.picture

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j
    else:
        return "no match"


@app.route('/api/get_user_games', methods=['POST'])
def get_user_games():
    import json
    import collections
    from Unchained import Match

    data = request.get_json()
    user_id = data.get('user_id')
    games = Match.query.filter(or_(Match.player1_id == user_id, Match.player2_id == user_id)).all()
    objects_list = []

    if games:

        for item in games:
            game = Match.query.get(item.id)

            d = collections.OrderedDict()
            d['id'] = game.id
            d['sport_id'] = game.sport_id
            d['player1_id'] = game.player1_id
            d['player2_id'] = game.player2_id
            d['is_team'] = game.is_team
            d['date'] = game.date
            d['time'] = game.time
            d['facility_id'] = game.facility_id
            d['complete'] = game.complete
            d['winner_id'] = game.winner_id
            d['score_1'] = game.score_1
            d['score_2'] = game.score_2

            objects_list.append(d)

        j = json.dumps(objects_list)
        return j

    else:
        return "no games"

@app.route('/api/get_conversation_messages', methods=['POST'])
def get_conversation_messages():
    import json
    import collections
    from Unchained import UserHasMessage
    from Unchained import Message
    from Unchained import User
    
    data = request.get_json()
    conversation_id = data.get('conversation_id')
    uhm = UserHasMessage.query.filter(UserHasMessage.conversation_id == conversation_id).all()
    objects_list = []
    
    if uhm:
        for item in uhm:
            user = User.query.get(item.user_id)
            message = Message.query.get(item.message_id)
            
            d = collections.OrderedDict()
            d['id'] = message.id
            d['uhm_id'] = item.id
            d['user_id'] = item.user_id
            d['sender_first_name'] = user.first_name
            d['sender_last_name'] = user.last_name
            d['message'] = message.body
            d['time'] = message.time
            d['is_read_user_one'] = item.is_read_user_one
            d['is_read_user_two'] = item.is_read_user_two
            d['picture'] = user.picture
            
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j
    
    else:
        return "no messages"

@app.route('/api/get_user_conversations', methods=['POST'])
def get_user_conversations():
    import json
    import collections
    from Unchained import Conversation
    from Unchained import User
    
    data = request.get_json()
    user_id = data.get('user_id')
    uhc = Conversation.query.filter(or_(Conversation.user_one == user_id, Conversation.user_two == user_id)).all()
    objects_list = []
    
    if uhc:
        
        for item in uhc:
            
            if item.user_one == user_id:
                user = User.query.get(item.user_two)
            else:
                user = User.query.get(item.user_one)
        
            d = collections.OrderedDict()
            d['id'] = item.id
            d['convo_user_id'] = user.id
            d['first_name'] = user.first_name
            d['last_name'] = user.last_name
            d['picture'] = user.picture
    
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j

    else:
        return "no conversations"

@app.route('/api/get_team_channels', methods=['POST'])
def get_teams_channels():
    import json
    import collections
    from Unchained import Channel
    from Unchained import TeamHasChannel
    from Unchained import User
    from Unchained import UserHasTeam
    from Unchained import Team
    
    data = request.get_json()
    user_id = data.get('user_id')
    uht = UserHasTeam.query.filter(UserHasTeam.user_id == user_id).all()
    objects_list = []
    
    if uht:
        for item in uht:
            thc = TeamHasChannel.query.filter(TeamHasChannel.team_id == item.team_id).all()
            
            for chan in thc:

                channel = Channel.query.get(chan.channel_id)
                user = User.query.get(channel.admin_id)
                team = Team.query.get(chan.team_id)
            
                d = collections.OrderedDict()
                d['id'] = channel.id
                d['name'] = channel.name
                d['description'] = channel.description
                d['admin_id'] = channel.admin_id
                d['first_name'] = user.first_name
                d['last_name'] = user.last_name
                d['team_picture'] = team.picture
            
                objects_list.append(d)
    
    
        j = json.dumps(objects_list)
        return j
    
    else:
        return "no channels"

@app.route('/api/get_channel_messages', methods=['POST'])
def get_channel_messages():
    import json
    import collections
    from Unchained import ChannelHasMessage
    from Unchained import Message
    from Unchained import User
    
    data = request.get_json()
    channel_id = data.get('channel_id')
    chm = ChannelHasMessage.query.filter(ChannelHasMessage.channel_id == channel_id).all()
    objects_list = []
    
    if chm:
        for item in chm:
            message = Message.query.get(item.message_id)
            user = User.query.get(message.user_id)
            
            d = collections.OrderedDict()
            d['id'] = message.id
            d['sender_first_name'] = user.first_name
            d['sender_last_name'] = user.last_name
            d['message'] = message.body
            d['time'] = message.time
            d['picture'] = user.picture
            
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j
    
    else:
        return "no messages"

@app.route('/api/get_team_has_channel', methods=['POST'])
def get_team_has_channel():
    import json
    import collections
    from Unchained import TeamHasChannel

    data = request.get_json()
    team_id = data.get('team_id')
    thc = TeamHasChannel.query.filter(TeamHasChannel.team_id == team_id).all()
    objects_list = []

    for item in thc:
            
        d = collections.OrderedDict()
        d['id'] = item.id
        d['team_id'] = item.team_id
        d['channel_id'] = item.channel_id
                
        objects_list.append(d)

    j = json.dumps(objects_list)
    return j

@app.route('/api/get_team_notifications', methods=['POST'])
def get_team_notifications():
    import json
    import collections
    from Unchained import UserHasTeam
    from Unchained import TeamHasNotification
    
    data = request.get_json()
    user_id = data.get('user_id')
    
    team = UserHasTeam.query.filter(UserHasTeam.user_id == user_id).all()
    objects_list = []
    
    if team:
        
        for item in team:
            thn = TeamHasNotification.query.filter(TeamHasNotification.team_id == item.team_id).all()
            
            if thn:
                
                for object in thn:
            
                    d = collections.OrderedDict()
                    d['id'] = object.id
                    d['team_id'] = object.team_id
                    d['notification'] = object.notification
                    d['time'] = object.time
                    d['link'] = object.link
                    d['is_read'] = object.is_read
            
                    objects_list.append(d)
    
            else:
                return "no team notifications"
        
        j = json.dumps(objects_list)
        return j
    
    else:
        return "no team notifications"

@app.route('/api/get_team_notifications_test', methods=['GET'])
def get_team_notifications_test():
    import json
    import collections
    from Unchained import UserHasTeam
    from Unchained import TeamHasNotification
    
    data = request.get_json()
    user_id = 1
    
    team = UserHasTeam.query.filter(UserHasTeam.user_id == user_id).all()
    objects_list = []
    
    if team:
        
        for item in team:
            thn = TeamHasNotification.query.filter(TeamHasNotification.team_id == item.team_id).all()
            
            if thn:
                
                d = collections.OrderedDict()
                d['id'] = thn[0].id
                d['team_id'] = thn[0].team_id
                d['notification'] = thn[0].notification
                d['time'] = thn[0].time
                d['link'] = thn[0].link
                d['is_read'] = thn[0].is_read
                
                objects_list.append(d)
            
            else:
                return "no team notifications"

        j = json.dumps(objects_list)
        return j

    else:
        return "no team notifications"

@app.route('/api/get_user_notifications', methods=['POST'])
def get_user_notifications():
    import json
    import collections
    from Unchained import UserHasNotification
    
    data = request.get_json()
    user_id = data.get('user_id')
    
    notification = UserHasNotification.query.filter(UserHasNotification.user_id == user_id).all()
    objects_list = []
    
    if notification:
        
        for item in notification:
            
            d = collections.OrderedDict()
            d['id'] = item.id
            d['user_id'] = item.user_id
            d['notification'] = item.notification
            d['time'] = item.time
            d['link'] = item.link
            d['is_read'] = item.is_read
            
            objects_list.append(d)
        
        j = json.dumps(objects_list)
        return j
    
    else:
        return "no user notifications"

@app.route('/api/send_message', methods=['POST'])
def send_message():
    import pusher
    import json
    
    data = request.get_json()
    event = data.get('event_id')
    sender_first_name = data.get('sender_first_name')
    sender_last_name = data.get('sender_last_name')
    picture = data.get('picture')
    time = data.get('time')
    message = data.get('message')
    
    pusher_client = pusher.Pusher(
                                  app_id='186366',
                                  key='56753b214ab2420a7230',
                                  secret='a10176f8256201a9f921',
                                  ssl=True
                                  )

    pusher_client.trigger('unchained', event, {'sender_first_name': sender_first_name, 'sender_last_name': sender_last_name, 'picture': picture, 'time': time, 'message': message})

    return "Success"

@app.route('/api/increase_message_count', methods=['POST'])
def increase_message_count():
    import pusher
    import json
    
    data = request.get_json()
    recipient_id = data.get('recipient_id')
    convo_id = data.get('convo_id')

    pusher_client = pusher.Pusher(
                                  app_id='186366',
                                  key='56753b214ab2420a7230',
                                  secret='a10176f8256201a9f921',
                                  ssl=True
                              )

    pusher_client.trigger('unchained', 'new_message', {'message': 'increase_count', 'to': recipient_id, 'convo_id': convo_id})

    return "Success"



app.debug = True

if __name__ == '__main__':
    print "\n"
    print " * Sportznegger Development Server - Ver. 0.1"
    print " *"
    app.run(debug=False, port=5000)
