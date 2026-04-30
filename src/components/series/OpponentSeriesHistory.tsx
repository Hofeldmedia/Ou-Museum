import type { OpponentSeriesHistoryEntry } from '../../types/seriesHistory';

type OpponentSeriesHistoryProps = {
  history?: OpponentSeriesHistoryEntry;
};

function formatValue(value: string | number | null | undefined) {
  return value ?? 'Data pending';
}

function formatFirstMeeting(history: OpponentSeriesHistoryEntry) {
  const { date, location, result, score } = history.firstMeeting;
  if (!date && !location && !result && !score) return 'Data pending';

  return [date, location, result, score].filter(Boolean).join(' | ');
}

function formatRecord(history: OpponentSeriesHistoryEntry) {
  const { ouWins, opponentWins, ties } = history.allTimeRecord;
  if (ouWins === null || opponentWins === null || ties === null) return 'Data pending';

  return `${ouWins}-${opponentWins}-${ties}`;
}

function SeriesValue({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-md border border-charcoal/10 bg-cream/70 px-3 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-charcoal/48">{label}</p>
      <p className="mt-1 text-sm font-bold text-charcoal">{formatValue(value)}</p>
    </div>
  );
}

export function OpponentSeriesHistory({ history }: OpponentSeriesHistoryProps) {
  if (!history) {
    return (
      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">OU Series History</p>
        <p className="mt-2 text-sm leading-6 text-charcoal/68">Series history has not been added yet.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">OU vs. {history.opponentName}</p>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-charcoal/62">
            {history.dataStatus.replace('-', ' ')}
          </span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SeriesValue label="First meeting" value={formatFirstMeeting(history)} />
          <SeriesValue label="All-time record" value={formatRecord(history)} />
        </div>
      </section>

      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Streaks</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SeriesValue label="Current streak" value={history.currentStreak} />
          <SeriesValue label="Longest OU win streak" value={history.longestOUWinStreak} />
          <SeriesValue label="Longest opponent win streak" value={history.longestOpponentWinStreak} />
        </div>
      </section>

      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Biggest margins</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SeriesValue label="Biggest OU margin" value={history.biggestOUMargin} />
          <SeriesValue label="Biggest opponent margin" value={history.biggestOpponentMargin} />
        </div>
      </section>

      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Notable games</p>
        {history.notableGames.length ? (
          <div className="mt-3 grid gap-2">
            {history.notableGames.map((game, index) => (
              <div key={`${game.year ?? 'pending'}-${index}`} className="rounded-md border border-charcoal/10 bg-cream/70 px-3 py-3">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-charcoal">{formatValue(game.year)} | {formatValue(game.score)}</p>
                <p className="mt-1 text-sm font-semibold text-charcoal/78">{formatValue(game.location)}</p>
                <p className="mt-1 text-sm text-charcoal/68">{formatValue(game.significance)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-charcoal/68">Data pending</p>
        )}
      </section>

      <section className="rounded-md border border-charcoal/10 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-charcoal/50">Source notes</p>
        <p className="mt-1 text-sm leading-6 text-charcoal/68">{history.sourceNotes}</p>
      </section>
    </div>
  );
}
