import React, { useState } from 'react';
import PianoRoll from './PianoRoll';

const MidiCanvas = ({midiData}) => {
  return (
    <div className="p-4">

      {midiData && (
        <div className="mt-4">
          {/* <h4 className="font-bold mb-4 text-action">Happy Birthday</h4> */}
          <div>
            <PianoRoll midiData={midiData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MidiCanvas;