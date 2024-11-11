import React, { useState } from 'react';
import { Midi } from '@tonejs/midi';
import PianoRoll from './PianoRoll';

const MidiCanvas = () => {
  const [midiData, setMidiData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const midi = new Midi(e.target.result);
          setMidiData(midi);
          setError(null);
        } catch (err) {
          setError('Error parsing MIDI file: ' + err.message);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error handling file: ' + err.message);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="file"
          accept=".mid,.midi"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {midiData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Happy Birthday</h2>
          <div className="border rounded">
            <PianoRoll midiData={midiData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MidiCanvas;