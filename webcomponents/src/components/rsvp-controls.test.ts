import fs from 'node:fs';
import path from 'node:path';

const file = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'rsvp-controls.ts'), 'utf8');

describe('rsvp-controls icons', () => {
  it('uses standard fullscreen icons', () => {
    expect(file).toContain('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-2-4h2V7h-3V5h5v5z');
    expect(file).toContain('M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z');
  });
});
