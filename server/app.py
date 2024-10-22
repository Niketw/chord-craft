from flask import Flask, request, jsonify, session, current_app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_session import Session
from config import ApplicationConfig
from models import db, User
from dotenv import load_dotenv
from sqlalchemy import select
import random
import os

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
mail = Mail(app)
C_PORT = int(os.getenv("C_PORT"))

CORS(app, supports_credentials=True, resources={r"/*": {"origins": f"http://localhost:{C_PORT}"}})
server_session = Session(app)
db.init_app(app)

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


# @app.route("/register", methods=["POST"])
# def register_user():
#     name = request.json["name"]
#     email = request.json["email"]
#     password = request.json["password"]
#
#     user_exists = User.query.filter_by(email=email).first() is not None
#
#     if user_exists:
#         return jsonify({"error": "User already exists"}), 409
#
#     hashed_password = bcrypt.generate_password_hash(password)
#     new_user = User(name=name, email=email, password=hashed_password)
#     db.session.add(new_user)
#     db.session.commit()
#
#     # Generate OTP
#     otp = random.randint(100000, 999999)
#     session["otp"] = otp  # Store OTP in session for verification
#     print("Generated OTP:", otp)  # Debug log
#     send_otp(email, otp)  # Send OTP to user email
#
#     return jsonify({
#         "id": new_user.id,
#         "name": new_user.name,
#         "email": new_user.email,
#         "message": "Registration successful! Please verify your email."
#     }), 201
#
#
# @app.route("/verify", methods=["POST"])
# def verify_otp():
#     otp = request.json.get("otp")
#
#     print("OTP from session:", session.get("otp"))  # Debug log
#     print("OTP entered by user:", otp)  # Debug log
#
#     if otp is None or session.get("otp") != int(otp):  # Ensure comparison is with an integer
#         return jsonify({"error": "Invalid OTP"}), 401
#
#     # OTP is valid, clear the OTP from session
#     session.pop("otp")
#
#     return jsonify({"message": "Email verified successfully!"})
#
#


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
    otp = request.json.get('otp') # Use .get() to safely retrieve data
    print(otp)
    try:
        # Check if OTP matches the one in the session
        if 'otp' in session:
            print(f"Session OTP: {session.get('otp')}, Provided OTP: {otp}")  # Debug log
            # Retrieve the user from the database using the email stored in session
            email = session.get('email')
            print(f"Retrieving user with email: {email}")  # Debug log
            user = User.query.filter_by(email=email).first()

            if user:
                # Mark OTP as verified
                user.otp_verified = True
                db.session.commit()

                # Clear OTP and email from session after successful verification
                session.pop('otp', None)
                session.pop('email', None)

                return jsonify({"message": "OTP verified successfully! Please login."}), 200
            else:
                return jsonify({"error": "User not found."}), 404
        else:
            return jsonify({"error": "No OTP in session."}), 400

    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


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


PORT = int(os.getenv("S_PORT"))

if __name__ == "__main__":
    app.run(debug=True, port=PORT)
