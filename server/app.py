from flask import Flask, request, jsonify, session, current_app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_session import Session
from matplotlib.font_manager import json_load
from mido.scripts.mido_play import play_file
import json
from config import ApplicationConfig
from models import db, User
from dotenv import load_dotenv
from sqlalchemy import select
import random
import os
import pretty_midi
import matplotlib.pyplot as plt
import numpy as np
from comparator import *
import base64
from songs import get_midi_from_database, MidiStorage, store_played_midi, get_played_midi_from_database, delete_played_midi

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
mail = Mail(app)
C_PORT = int(os.getenv("C_PORT"))

CORS(app, supports_credentials=True, resources={r"/*": {"origins": f"http://localhost:{C_PORT}"}})
server_session = Session(app)
db.init_app(app)

midi = pretty_midi.PrettyMIDI()

load_dotenv()

with app.app_context():
    db.create_all()


def send_otp(email, otp):
    msg = Message("Your OTP Code", recipients=[email])
    msg.body = f"Your OTP code is: {otp}"
    with current_app.app_context():
        mail.send(msg)


@app.route('/@me', methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    print(user_id)

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })




@app.route('/register', methods=['POST'])
def register_user():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    try:
        # Check if the user already exists
        query = select(User).where(User.email == email)
        existing_user = db.session.execute(query).scalar_one_or_none()

        if existing_user:
            if not existing_user.otp_verified:
                # If the OTP is not verified, delete the old user data
                db.session.delete(existing_user)
                db.session.commit()
                print(f"Existing user data removed: {existing_user}")
            else:
                # If OTP is verified, inform the user that the account exists
                return jsonify({"error": "Account with this email already exists."}), 400

        hashed_password = bcrypt.generate_password_hash(password)

        # Generate OTP
        otp = random.randint(100000, 999999)
        session["otp"] = otp  # Store OTP in session for verification
        session["email"] = email  # Store email in session for verification
        print("Generated OTP:", otp)  # Debug log
        send_otp(email, otp)  # Send OTP to user email

        # Create new user
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            otp_verified=False
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully! OTP sent."}), 201

    except Exception as e:
        print(f"Error occurred during signup: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/verify", methods=["POST"])
def verify_otp():
    otp = request.json.get('otp')
    
    try:
        # Password Reset Flow
        if 'reset_otp' in session:
            if str(otp) == str(session.get('reset_otp')):
                # Update password in database
                user = User.query.filter_by(email=session.get('reset_email')).first()
                if user:
                    user.password = session.get('new_password')
                    db.session.commit()
                    
                    # Clear reset-related session data
                    session.pop('reset_otp', None)
                    session.pop('reset_email', None)
                    session.pop('new_password', None)
                    
                    return jsonify({"message": "Password reset successful"}), 200
                return jsonify({"error": "User not found"}), 404
            return jsonify({"error": "Invalid OTP"}), 400
            
        # Regular Registration Flow
        if 'otp' in session:
            if str(otp) == str(session.get('otp')):
                email = session.get('email')
                user = User.query.filter_by(email=email).first()
                if user:
                    user.otp_verified = True
                    db.session.commit()
                    session.pop('otp', None)
                    session.pop('email', None)
                    return jsonify({"message": "Email verified successfully"}), 200
                return jsonify({"error": "User not found"}), 404
            return jsonify({"error": "Invalid OTP"}), 400
            
        return jsonify({"error": "No OTP verification in progress"}), 400

    except Exception as e:
        print(f"Error in verify_otp: {e}")
        return jsonify({"error": "Failed to verify OTP"}), 500


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    if not user.otp_verified:
        return jsonify({"error": "Account is not verified. Please verify your OTP before logging in."}), 403

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"


@app.route("/comparator", methods=["POST"])
def comparator():
    print("in backend")
    # Check if base64 string is provided in request
    if "played_file_base64" not in request.json:
        return jsonify({"error": "No base64 file data provided"}), 400

    # Get the base64 string and song name from request
    played_file_base64 = request.json.get("played_file_base64")
    song_name = request.json.get("song_name")

    try:
        # Clean the base64 string
        # Remove potential 'data:audio/midi;base64,' prefix if it exists
        if ';base64,' in played_file_base64:
            played_file_base64 = played_file_base64.split(';base64,')[1]
        
        # Remove any whitespace, newlines, or padding issues
        played_file_base64 = played_file_base64.strip()
        
        # Add padding if necessary
        padding = len(played_file_base64) % 4
        if padding:
            played_file_base64 += '=' * (4 - padding)

        try:
            # Decode base64 string to binary
            binary_data = base64.b64decode(played_file_base64)
            
            # Verify we got some data
            if not binary_data:
                return jsonify({"error": "Decoded data is empty"}), 400
                
            print(f"Successfully decoded {len(binary_data)} bytes")
            
        except base64.binascii.Error as e:
            print(f"Base64 decoding error: {str(e)}")
            return jsonify({"error": "Invalid base64 encoding"}), 400

        # Save binary data temporarily
        temp_file_path = os.path.join("temp", "recorded.mid")
        os.makedirs(os.path.dirname(temp_file_path), exist_ok=True)

        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(binary_data)

        # Store the MIDI file in database
        played_file = store_played_midi(temp_file_path)

        try:
            original_file = get_midi_from_database(song_name)
        except FileNotFoundError:
            return jsonify({"error": f"Original song '{song_name}' not found in the database."}), 404

        # Get played file name
        played_file_name = played_file.filename
        if "filename=" in played_file_name:
            played_file_name = played_file_name.split("filename=")[1][:-1]

        try:
            played_file = get_played_midi_from_database(played_file_name)
        except FileNotFoundError:
            return jsonify({"error": f"Played song '{played_file_name}' not found in the database."}), 404

        # Load and process MIDI files
        original_notes, original_tempos, original_times, original_length = load_midi(original_file)
        played_notes, played_tempos, played_times, played_length = load_midi(played_file)

        # Compare and visualize
        max_length = min(original_length, played_length)
        segment_duration = 3.0
        results, visualization2_path = compare_accuracies_per_segment(
            original_notes, played_notes, original_tempos, played_tempos, original_times,
            played_times, segment_duration, max_length
        )

        visualization_path = visualize_all_midi_notes(original_notes, played_notes, max_length)

        # Convert visualizations to base64
        with open(visualization_path, "rb") as image_file:
            visualization_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        with open(visualization2_path, "rb") as image_file:
            visualization2_base64 = base64.b64encode(image_file.read()).decode('utf-8')

        # Clean up temporary file
        os.remove(temp_file_path)

        print("leaving backend")
        return jsonify({
            "accuracy": results,
            "visualization": visualization_base64,
            "visualization2": visualization2_base64
        })

    except Exception as e:
        return jsonify({"error": f"Error processing MIDI data: {str(e)}"}), 500

@app.route('/songs', methods=['GET'])
def get_songs():
    # try:
    #     with app.app_context():
    #         songs = MidiStorage.query.all()  # Get all songs from the database
    #         song_names = [song.filename for song in songs]  # Extract song names
    #     return jsonify({"songs": song_names})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500
    #Bhai file ka naam nahi pura file bhejna tha

    try:
        with app.app_context():
            songs = MidiStorage.query.all()
            # Prepare a tuple of dictionaries where the key is filename and value is base64-encoded file_data
            songs_data = [
                {"name":song.filename, "data":base64.b64encode(song.file_data).decode("utf-8")}
                for song in songs
            ]
        return jsonify({"songs": songs_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/library-items', methods=['GET'])
def get_library_items():
    with app.app_context():
        # Retrieve songs sorted by clicks in descending order
        songs = MidiStorage.query.order_by(MidiStorage.clicks.desc()).all()

        song_list = [
            {
                'id': song.id,
                'image': f"data:image/jpeg;base64,{base64.b64encode(song.cover).decode('utf-8')}",
                # Convert binary to Base64
                'title': song.filename,
                'subtitle': song.artist,
                'clicks': song.clicks  # Include clicks for sorting purpose
            }
            for song in songs
        ]
        return jsonify(song_list)


@app.route('/increment-clicks', methods=['POST'])
def increment_clicks():
    data = request.get_json()

    if not data or 'song_name' not in data:
        return jsonify({'error': 'Song name is required'}), 400

    song_name = data['song_name']

    with app.app_context():
        midi_record = MidiStorage.query.filter_by(filename=song_name).first()

        if not midi_record:
            return jsonify({'error': f"No song found with the name '{song_name}'"}), 404

        # Increment the clicks count
        midi_record.clicks += 1
        db.session.commit()

        return jsonify({'message': f"Clicks for '{song_name}' incremented successfully.", 'clicks': midi_record.clicks})


@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    new_password = request.json.get('newPassword')
    
    try:
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "No account found with this email"}), 404

        # Generate and store OTP
        otp = random.randint(100000, 999999)
        session["reset_otp"] = str(otp)
        session["reset_email"] = email
        session["new_password"] = bcrypt.generate_password_hash(new_password).decode('utf-8')
        
        # Send OTP email
        msg = Message("Password Reset OTP", recipients=[email])
        msg.body = f"Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes."
        mail.send(msg)

        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as e:
        print(f"Error in forgot_password: {e}")
        return jsonify({"error": "Failed to process request"}), 500


PORT = int(os.getenv("S_PORT"))

if __name__ == "__main__":
    app.run(debug=True, port=PORT)