import os
import pygame
from flask import Flask
from models import db, MidiStorage, PlayedMidi

# Initialize Flask app for database context
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = r"sqlite:///./db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize pygame mixer for playing MIDI files
pygame.init()
pygame.mixer.init()


#ADD
def store_midi():
    file_path = input("Enter the path to the MIDI file: ")
    cover_image_path = input("Enter cover image path: ")
    artist_name = input("Enter artist name: ")
    file_data = 0
    cover_data = 0

    if not os.path.exists(file_path):
        print(f"File '{file_path}' does not exist.")
        return

    if not os.path.exists(cover_image_path):
        print(f"Cover image '{cover_image_path}' does not exist.")
        return

    with open(file_path, 'rb') as file:
        file_data = file.read()  # Read the MIDI file as binary data

    with open(cover_image_path, 'rb') as cover_file:
        cover_data = cover_file.read()  # Read the cover image as binary data

    # Extract filename and remove the .mid extension if present
    filename = os.path.basename(file_path)
    filename = filename.rsplit('.mid', 1)[0]  # Remove the .mid extension

    # Check for duplicate filename
    with app.app_context():
        existing_midi = MidiStorage.query.filter_by(filename=filename).first()
        if existing_midi:
            print(f"A MIDI file with the name '{filename}' already exists.")
            return

    # Create a new MidiStorage record with artist name and cover data
    new_midi = MidiStorage(
        filename=filename,
        file_data=file_data,
        artist=artist_name,
        cover=cover_data,
        clicks=0  # Initialize clicks to 0
    )
    with app.app_context():
        db.session.add(new_midi)
        db.session.commit()
        print(f"MIDI file '{filename}' stored successfully with artist '{artist_name}' and cover image!")


def play_midi():
    """Function to retrieve and play a MIDI file by its name."""
    song_name = input("Enter the name of the MIDI file to play: ")
    with app.app_context():
        midi_file = MidiStorage.query.filter_by(filename=song_name).first()
        print(midi_file.clicks)
        if midi_file:
            temp_file_path = f"{midi_file.filename}_temp.mid"
            with open(temp_file_path, 'wb') as temp_file:
                temp_file.write(midi_file.file_data)

            try:
                print(f"Playing MIDI file: {midi_file.filename}")
                pygame.mixer.music.load(temp_file_path)
                pygame.mixer.music.play()

                # Wait for playback to finish
                while pygame.mixer.music.get_busy():
                    pygame.time.Clock().tick(10)
            finally:
                os.remove(temp_file_path)  # Clean up temporary file
        else:
            print(f"No MIDI file found with the name '{song_name}'")

def delete_midi(filename):
    """Function to delete a MIDI file from the database based on the filename."""
    song_name = input("Enter the name of the MIDI file to play: ")
    with app.app_context():
        # Search for the MIDI file in the database
        midi_to_delete = MidiStorage.query.filter_by(filename=filename).first()
        if not midi_to_delete:
            print(f"No MIDI file with the name '{filename}' found in the database.")
            return

        # Delete the MIDI file
        db.session.delete(midi_to_delete)
        db.session.commit()
        print(f"MIDI file '{filename}' deleted from the database successfully.")



def get_midi_from_database(song_name):
    """Fetch the MIDI song from the database based on the filename."""
    with app.app_context():
        midi_file = MidiStorage.query.filter_by(filename=song_name).first()
        print(midi_file)
        if midi_file:

            # Write the binary data to a temporary file
            temp_file_path = f"temp/{midi_file.filename}.mid"  # Adjust path as needed
            print(temp_file_path)
            with open(temp_file_path, 'wb') as temp_file:
                temp_file.write(midi_file.file_data)
            return temp_file_path
        else:
            raise FileNotFoundError(f"Song '{song_name}' not found in the database.")



def store_played_midi(file_path):
    """Function to store a MIDI file in the database without the .mid extension in the filename."""
    if not os.path.exists(file_path):
        print(f"File '{file_path}' does not exist.")
        return

    with open(file_path, 'rb') as file:
        file_data = file.read()  # Read the MIDI file as binary data

    # Extract filename and remove the .mid extension if present
    filename = os.path.basename(file_path)
    filename = filename.rsplit('.mid', 1)[0]  # Remove the .mid extension

    # Check for duplicate filename
    with app.app_context():
        existing_midi = PlayedMidi.query.filter_by(filename=filename).first()
        if existing_midi:
            print(f"A MIDI file with the name '{filename}' already exists.")
            return existing_midi

    # Create a new MidiStorage record
    new_midi = PlayedMidi(filename=filename, file_data=file_data)
    with app.app_context():
        db.session.add(new_midi)
        db.session.commit()
        print(f"MIDI file '{filename}' stored successfully!")
        return new_midi


# Function to retrieve Played MIDI from the database
def get_played_midi_from_database(song_name):
    """Fetch the played MIDI song from the database based on the filename."""
    with app.app_context():
        print(song_name)
        midi_file = PlayedMidi.query.filter_by(filename=song_name).first()

        if midi_file:
            # Write the binary data to a temporary file
            temp_file_path = f"temp/{midi_file.filename}.mid"  # Adjust path as needed
            with open(temp_file_path, 'wb') as temp_file:
                temp_file.write(midi_file.file_data)

            return temp_file_path
        else:
            raise FileNotFoundError(f"Song '{song_name}' not found in the database.")


def delete_played_midi(filename):
    """Function to delete a MIDI file from the database based on the filename."""
    with app.app_context():
        # Search for the MIDI file in the database
        midi_to_delete = PlayedMidi.query.filter_by(filename=filename).first()
        if not midi_to_delete:
            print(f"No MIDI file with the name '{filename}' found in the database.")
            return

        # Delete the MIDI file
        db.session.delete(midi_to_delete)
        db.session.commit()
        print(f"MIDI file '{filename}' deleted from the database successfully.")



if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure the table exists

        while True:
            option = input(
                "Choose an option: 'add' to store a MIDI, 'delete' to delete a MIDI, 'play' to play a MIDI, or 'exit' to quit: ").lower()
            if option == 'exit':
                print("Exiting the program.")
                break
            elif option == 'add':
                store_midi()
            elif option == 'delete':
                delete_midi()
            elif option == 'play':
                play_midi()
            else:
                print("Invalid option. Please type 'add', 'play', or 'exit'.")
