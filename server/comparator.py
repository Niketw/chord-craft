import app
import pretty_midi
import matplotlib.pyplot as plt
import numpy as np



#Function to load MIDI files and extract note and tempo information
def load_midi(file_path):
    midi_file = pretty_midi.PrettyMIDI(file_path)
    notes = []

    for instrument in midi_file.instruments:
        for note in instrument.notes:
            notes.append((note.pitch, note.start, note.end, note.velocity))

    # Extract tempo information (times and tempos)
    times, tempos = midi_file.get_tempo_changes()

    # Return notes, tempos, and total length of the MIDI file
    return notes, tempos, times, midi_file.get_end_time()

# Function to truncate notes based on the shorter soundtrack length
def truncate_notes(notes, max_length):
    return [(pitch, start, min(end, max_length), velocity) for pitch, start, end, velocity in notes if
            start < max_length]

# Function to get the average tempo for a given segment
def get_segment_average_tempo(tempos, times, segment_start, segment_end):
    relevant_tempos = []
    for i, time in enumerate(times):
        if time >= segment_start and time < segment_end:
            relevant_tempos.append((tempos[i], time))

    if len(relevant_tempos) == 0:
        idx = np.searchsorted(times, segment_start, side='right') - 1
        return tempos[idx] if idx >= 0 else tempos[0]

    if times[0] < segment_start:
        idx = np.searchsorted(times, segment_start, side='right') - 1
        relevant_tempos.insert(0, (tempos[idx], segment_start))

    total_duration = 0
    weighted_tempo_sum = 0
    for i in range(len(relevant_tempos)):
        tempo, change_time = relevant_tempos[i]
        next_time = segment_end if i == len(relevant_tempos) - 1 else relevant_tempos[i + 1][1]
        duration = next_time - max(segment_start, change_time)
        total_duration += duration
        weighted_tempo_sum += tempo * duration

    return weighted_tempo_sum / total_duration if total_duration > 0 else tempos[0]

# Function to calculate and print accuracies per segment
def compare_accuracies_per_segment(original_notes, played_notes, original_tempos, played_tempos, original_times,
                                   played_times, segment_duration, max_length, tolerance=0.05):
    num_segments = int(max_length // segment_duration)
    for i in range(num_segments):
        start_time = i * segment_duration
        end_time = (i + 1) * segment_duration

        # Extract notes for the current segment
        original_segment = [note for note in original_notes if note[1] < end_time and note[2] > start_time]
        played_segment = [note for note in played_notes if note[1] < end_time and note[2] > start_time]

        # Calculate pitch accuracy
        original_pitches = [note[0] for note in original_segment]
        played_pitches = [note[0] for note in played_segment]
        matches = sum(1 for pitch in played_pitches if pitch in original_pitches)
        total_notes = len(played_pitches)
        pitch_accuracy = (matches / total_notes) * 100 if total_notes > 0 else 0

        # Calculate tempo accuracy
        original_segment_tempo = get_segment_average_tempo(original_tempos, original_times, start_time, end_time)
        played_segment_tempo = get_segment_average_tempo(played_tempos, played_times, start_time, end_time)
        tempo_accuracy = (1 - abs(
            original_segment_tempo - played_segment_tempo) / original_segment_tempo) * 100 if original_segment_tempo > 0 else 0

        # Calculate dynamics accuracy based on velocity
        original_velocities = [note[3] for note in original_segment]
        played_velocities = [note[3] for note in played_segment]
        velocity_matches = sum(1 for vel in played_velocities if vel in original_velocities)
        dynamics_accuracy = (velocity_matches / total_notes) * 100 if total_notes > 0 else 0

        # Calculate rhythm accuracy based on onset times with tolerance
        original_onsets = sorted(note[1] for note in original_segment)
        played_onsets = sorted(note[1] for note in played_segment)

        rhythm_matches = 0
        original_idx = 0
        played_idx = 0

        while original_idx < len(original_onsets) and played_idx < len(played_onsets):
            if abs(original_onsets[original_idx] - played_onsets[played_idx]) <= tolerance:
                rhythm_matches += 1
                original_idx += 1
                played_idx += 1
            elif played_onsets[played_idx] < original_onsets[original_idx]:
                played_idx += 1
            else:
                original_idx += 1

        rhythm_accuracy = (rhythm_matches / len(played_onsets)) * 100 if len(played_onsets) > 0 else 0

        # Print results
        print(f"Segment {i + 1} ({start_time:.2f}s - {end_time:.2f}s):")
        print(f"  Pitch Accuracy: {pitch_accuracy:.2f}%")
        print(f"  Tempo Accuracy: {tempo_accuracy:.2f}%")
        print(f"  Dynamics Accuracy: {dynamics_accuracy:.2f}%")
        print(f"  Rhythm Accuracy: {rhythm_accuracy:.2f}%\n")


# Function to visualize all MIDI notes together (no segmentation)
def visualize_all_midi_notes(original_notes, played_notes, max_length):
    # Set the dark mode style
    plt.style.use('dark_background')

    fig, ax = plt.subplots(figsize=(12, 6))

    # Plot original MIDI notes in blue
    for pitch, start, end, velocity in original_notes:
        ax.add_patch(plt.Rectangle((start, pitch - 0.5), end - start, 1, color='#0000FF', alpha=0.7))

    # Plot played MIDI notes in red
    for pitch, start, end, velocity in played_notes:
        ax.add_patch(plt.Rectangle((start, pitch - 0.5), end - start, 1, color='#D30000', alpha=0.7))

    # Plot overlapping notes in green (where they match)
    for pitch, start, end, velocity in original_notes:
        for played_pitch, played_start, played_end, played_velocity in played_notes:
            if pitch == played_pitch and max(start, played_start) < min(end, played_end):
                overlap_start = max(start, played_start)
                overlap_end = min(end, played_end)
                ax.add_patch(
                    plt.Rectangle((overlap_start, pitch - 0.5), overlap_end - overlap_start, 1, color="#6200EA",
                                  alpha=0.7))

    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('MIDI Pitch', color='white')
    plt.title('MIDI Notes Visualization (Original in Blue, Played in Red, Overlap in Purple)', color='white')
    plt.xlim(0, max_length)
    plt.ylim(0, 128)  # MIDI pitch range is 0-127

    # Customize ticks for dark mode
    ax.tick_params(axis='x', colors='white')
    ax.tick_params(axis='y', colors='white')

    # Save the plot as an SVG, ensuring no transparency issues
    plt.savefig('midi_visualization.svg', format='svg', dpi=300, facecolor=fig.get_facecolor())

    # Show the plot
    return 'midi_visualization.svg'


# Function to compare MIDI notes, calculate accuracies, and visualize them
def compare_midi_notes(original_notes, played_notes, original_tempos, played_tempos, original_times, played_times,
                       segment_duration, max_length):
    # Truncate notes
    original_notes = truncate_notes(original_notes, max_length)
    played_notes = truncate_notes(played_notes, max_length)

    # Calculate accuracies
    compare_accuracies_per_segment(original_notes, played_notes, original_tempos, played_tempos, original_times,
                                   played_times, segment_duration, max_length)

    # Visualize the notes
    visualize_all_midi_notes(original_notes, played_notes, max_length)

