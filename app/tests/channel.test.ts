// 3-5w: a Preview copy keeps its own storage names, and the real copy's names stay exactly as they were (so nobody's saved data moves).
import { describe, expect, it } from 'vitest';
import { storageName, CHANNEL } from '../src/data/channel';

describe('storage names by channel', () => {
  it('the real app keeps the names it has always had', () => {
    expect(storageName('thy-kingdom', 'main')).toBe('thy-kingdom');
    expect(storageName('tkc.opened', 'main')).toBe('tkc.opened');
  });
  it('a Preview copy keeps its own', () => {
    expect(storageName('thy-kingdom', 'preview')).toBe('thy-kingdom-preview');
    expect(storageName('tkc.opened', 'preview')).toBe('tkc.opened-preview');
  });
  it('a build with no channel set is the real app', () => {
    expect(CHANNEL).toBe('main');
  });
});
