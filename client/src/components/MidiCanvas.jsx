import React, { useState, useEffect, useRef } from 'react';
import PianoRoll from './PianoRoll';
import { WebMidi } from "webmidi";
import * as Tone from 'tone';

const MidiCanvas = ({midiData, selectedSong}) => {
    const pianoRollRef = useRef();
    const synthRef = useRef(null);

    // Initialize synth
    useEffect(() => {
        // Create a polyphonic synth with piano-like settings
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "triangle"
            },
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.2,
                release: 1,
            },
            volume: 0
        }).toDestination();
        
        // Clean up on unmount
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
        };
    }, []);

    // Setup MIDI input
    useEffect(() => {
        const initializeWebMidi = async () => {
            try {
                await Tone.start(); // Initialize Tone.js
                await WebMidi.enable();
                
                let input = WebMidi.getInputByName("USB MIDI Controller");
                
                input.addListener("noteon", e => {
                    console.log("Parent: Note On Event", e);
                    
                    // Play the note using Tone.js
                    if (synthRef.current) {
                        const noteName = e.note.identifier;
                        const velocity = e.note.attack;
                        synthRef.current.triggerAttack(noteName, undefined, velocity);
                    }

                    // Pass the event to PianoRoll
                    if (pianoRollRef.current) {
                        pianoRollRef.current.handleNoteOn(e);
                    } else {
                        console.log("PianoRoll ref or handleNoteOn not available");
                    }
                });

                input.addListener("noteoff", e => {
                    console.log("Parent: Note Off Event", e);
                    
                    // Release the note using Tone.js
                    if (synthRef.current) {
                        const noteName = e.note.identifier;
                        synthRef.current.triggerRelease(noteName);
                    }

                    // Pass the event to PianoRoll
                    if (pianoRollRef.current) {
                        pianoRollRef.current.handleNoteOff(e);
                    } else {
                        console.log("PianoRoll ref or handleNoteOff not available");
                    }
                });
            } catch (error) {
                console.error("Error initializing WebMidi:", error);
            }
        };

        initializeWebMidi();

        // Cleanup
        return () => {
            WebMidi.disable();
        };
    }, []);

    return (
        <div className="">
            {midiData && <PianoRoll ref={pianoRollRef} midiData={midiData} selectedSong={selectedSong} />}
        </div>
    );
};

export default MidiCanvas;