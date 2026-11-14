import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ players: {}, ranking: 'points' }),
        })
    );
});

afterEach(() => {
    jest.resetAllMocks();
});

test('prikazuje naslov leaderboard-a', async () => {
    render(<App />);
    expect(screen.getByText('LEADERBOARD')).toBeInTheDocument();
    expect(screen.getByText('CS2')).toBeInTheDocument();
    expect(await screen.findByText(/Nema registrovanih igrača/)).toBeInTheDocument();
});
