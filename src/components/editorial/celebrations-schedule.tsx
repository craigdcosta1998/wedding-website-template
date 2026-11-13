// ABOUTME: Only permitted celebrations are rendered; pending logistics stay explicitly pending
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Celebration, CelebrationDetails } from '@/types/celebrations';
import styles from './celebrations.module.css';

function dateLabel(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'Europe/Rome' })
    .format(new Date(`${date}T12:00:00Z`));
}

function timeLabel(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric', minute: '2-digit', timeZone: 'Europe/Rome',
  }).format(new Date(date));
}

function safeMapUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export function CelebrationsSchedule({ celebrations, details }: {
  celebrations: readonly Celebration[];
  details: readonly CelebrationDetails[];
}) {
  return (
    <div className={styles.schedule}>
      {celebrations.map(event => {
        const detail = details.find(item => item.id === event.databaseEventId);
        const mapUrl = safeMapUrl(detail?.maps_url ?? null);
        return (
          <section key={event.key} id={event.key} aria-labelledby={`${event.key}-title`} className={styles.event}>
            <div className={styles.dateRail}>
              <p className={styles.overline}>Day {String(event.day).padStart(2, '0')}</p>
              <span className={styles.dateNumber} aria-hidden="true">{event.date.slice(-2)}</span>
              <span className={styles.month} aria-hidden="true">September</span>
            </div>
            <div className={styles.eventBody}>
              <div className={styles.eventHeading}>
                <div>
                  <time dateTime={event.date} className={styles.fullDate}>{dateLabel(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  <h2 id={`${event.key}-title`} className={styles.eventTitle}>{event.title}</h2>
                </div>
                <div className={styles.venue}>
                  <span className={styles.overline}>The setting</span>
                  <p>{event.venue}</p>
                </div>
              </div>
              {detail && <details className={styles.eventDetails}>
                <summary>Event details <ArrowDownRight size={17} strokeWidth={1} aria-hidden="true" /></summary>
                <div className={styles.detailBody}>
                  {detail.description_en && <p>{detail.description_en}</p>}
                  <dl>
                    <div><dt>Time</dt><dd><time dateTime={detail.event_date}>{timeLabel(detail.event_date)}</time>{detail.event_end_date && <> – <time dateTime={detail.event_end_date}>{timeLabel(detail.event_end_date)}</time></>}</dd></div>
                    {detail.dresscode_en && <div><dt>Dress code</dt><dd>{detail.dresscode_en}</dd></div>}
                    {detail.location_address && <div><dt>Address</dt><dd>{detail.location_address}</dd></div>}
                    {detail.directions_en && <div><dt>Getting there</dt><dd>{detail.directions_en}</dd></div>}
                    {detail.parking_en && <div><dt>Parking</dt><dd>{detail.parking_en}</dd></div>}
                  </dl>
                  {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>View map <ArrowUpRight size={16} strokeWidth={1} aria-hidden="true" /></a>}
                </div>
              </details>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
