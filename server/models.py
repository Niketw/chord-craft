from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(345), unique=False)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    otp_verified = db.Column(db.Boolean, default=False)



# Model definition for storing MIDI files
class MidiStorage(db.Model):
    __tablename__ = 'songs'  # Specify table name

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255), unique=False, nullable=False)
    file_data = db.Column(db.LargeBinary, unique=False, nullable=False)  # Store binary data for MIDI files
    artist = db.Column(db.String(255), unique=False, nullable=False)
    cover = db.Column(db.LargeBinary(255), unique=False, nullable=False)
    clicks = db.Column(db.Integer, unique=False, nullable=False, default = 0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())  # Timestamp for when the file was added

    def __repr__(self):
        return f"<MidiStorage id={self.id}, filename={self.filename}>"


# Define PlayedMidi model for storing MIDI files
class PlayedMidi(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(200), unique=True, nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=False)

    def __repr__(self):
        return f"<PlayedMidi id={self.id}, filename={self.filename}>"