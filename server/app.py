from flask import Flask, request, jsonify, session, current_app
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_session import Session
from config import ApplicationConfig
from models import db, User
import random

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
mail = Mail(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


def send_otp(email, otp):
    msg = Message("Your OTP Code", recipients=[email])
    msg.body = f"Your OTP code is: {otp}"
    with current_app.app_context():
        mail.send(msg)


@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Generate OTP
    otp = random.randint(100000, 999999)
    session["otp"] = otp  # Store OTP in session for verification
    print("Generated OTP:", otp)  # Debug log
    send_otp(email, otp)  # Send OTP to user email

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "message": "Registration successful! Please verify your email."
    }), 201


@app.route("/verify", methods=["POST"])
def verify_otp():
    otp = request.json.get("otp")

    print("OTP from session:", session.get("otp"))  # Debug log
    print("OTP entered by user:", otp)  # Debug log

    if otp is None or session.get("otp") != int(otp):  # Ensure comparison is with an integer
        return jsonify({"error": "Invalid OTP"}), 401

    # OTP is valid, clear the OTP from session
    session.pop("otp")

    return jsonify({"message": "Email verified successfully!"})


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"


if __name__ == "__main__":
    app.run(debug=True)
