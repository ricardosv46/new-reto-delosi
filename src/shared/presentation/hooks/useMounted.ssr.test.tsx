/** @jest-environment node */
import { renderToString } from 'react-dom/server';
import { useMounted } from './useMounted';

function Probe() {
  return <span>{useMounted() ? 'mounted' : 'server'}</span>;
}

describe('useMounted on the server', () => {
  it('should report false while rendering to HTML, so server and first client render match', () => {
    expect(renderToString(<Probe />)).toContain('server');
  });
});
