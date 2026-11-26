import { describe, it, expect } from 'vitest';
import { toMs } from '../src/ui/motion';
// A24: the production minifier turns 300ms into .3s; the code must read the unit.
describe('toMs', () => {
  it('reads ms and s', () => { expect(toMs('300ms')).toBe(300); expect(toMs('.3s')).toBe(300); expect(toMs('0.15s')).toBe(150); expect(toMs(' 1.2s ')).toBe(1200); expect(toMs('90ms')).toBe(90); expect(toMs('')).toBe(0); });
});
