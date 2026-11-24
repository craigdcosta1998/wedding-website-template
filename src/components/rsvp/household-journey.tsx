// ABOUTME: One household invitation, explicit responses and dietary notes for each named person
'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateWithCode, logout } from '@/app/actions/auth';
import { submitHouseholdRsvp } from '@/app/actions/household-rsvp';
import { validateHouseholdReply } from '@/lib/household-rsvp-validation';
import type { AttendanceAnswer, HouseholdRsvpData, HouseholdReply } from '@/types/household-rsvp';
import { Link } from '@/i18n/routing';
import styles from '@/components/editorial/rsvp.module.css';

export function HouseholdJourney({ initialData, previewData, ready }: {
  initialData: HouseholdRsvpData | null; previewData: HouseholdRsvpData | null; ready: boolean;
}) {
  const router = useRouter();
  const [demoOpen, setDemoOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const data = previewData ? (demoOpen ? previewData : null) : initialData;

  async function openInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (previewData) {
        if (code.trim().toUpperCase() !== 'DEMO01') setError('For this fictional preview, enter DEMO01.');
        else setDemoOpen(true);
      } else {
        const result = await authenticateWithCode(code);
        if (result.success) router.refresh();
        else setError(result.error ?? 'Your invitation could not be opened.');
      }
    } catch { setError('Your invitation could not be opened. Please try again.'); }
    finally { setBusy(false); }
  }

  async function leave() {
    setBusy(true); setError('');
    try {
      if (previewData) { setDemoOpen(false); setCode(''); }
      else { await logout(); router.refresh(); }
    } catch { setError('We could not close this invitation. Please try again.'); }
    finally { setBusy(false); }
  }

  return <>
    {previewData && <aside className={styles.notice} aria-label="Fictional planning preview">
      <strong>Local planning preview</strong>
      <p>Fictional guests. Use code <b>DEMO01</b>. No responses will be saved or emailed.</p>
      <Link href="/rsvp">Leave preview</Link>
    </aside>}
    {data ? <>
      <div className={styles.householdHeading}><div><p className={styles.eyebrow}>Your invitation</p><h2>{data.name}</h2></div>
        <button className={styles.textButton} type="button" onClick={leave} disabled={busy}>Change invitation</button>
      </div>
      <p className={styles.note}>Changing invitation signs you out. It does not delete saved responses.</p>
      <HouseholdReplyForm key={data.id} data={data} preview={Boolean(previewData)} />
    </> : ready ? <form onSubmit={openInvitation} className={styles.entry} aria-busy={busy}>
      <p>One invitation code opens the responses for everyone in your household.</p>
      <label htmlFor="invitation-code">Household invitation code</label>
      <div className={styles.codeRow}><input id="invitation-code" name="invitation-code" value={code} onChange={e => setCode(e.target.value)}
        autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={6} required aria-describedby={error ? 'invitation-error' : 'code-hint'} />
        <button className={styles.button} type="submit" disabled={busy}>{busy ? 'Opening invitation…' : 'Open invitation'}</button></div>
      <p className={styles.note} id="code-hint">Your six-character code will be included with your invitation.</p>
    </form> : <div className={styles.entry}>
      <p role="status">RSVP details are being finalised. Please check back soon.</p>
      <p>One household code will let you reply separately for each person on your invitation.</p>
      <Link className={styles.textButton} href="/events">The celebrations</Link>
    </div>}
    {error && <p ref={errorRef} tabIndex={-1} className={styles.error} role="alert" id="invitation-error">{error}</p>}
  </>;
}

export function HouseholdReplyForm({ data, preview }: { data: HouseholdRsvpData; preview: boolean }) {
  const [reply, setReply] = useState<HouseholdReply>(() => structuredClone(data.reply));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  function updateAnswer(guestId: string, eventId: string, status: AttendanceAnswer) {
    setReply(current => ({ guests: current.guests.map(g => g.id === guestId
      ? { ...g, answers: g.answers.map(a => a.eventId === eventId ? { ...a, status } : a) } : g) }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const validation = validateHouseholdReply(reply, data);
    if (!validation.valid) { setError(validation.error); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setBusy(true);
    try {
      // Fictional preview never invokes a server mutation or creates an authenticated session.
      const result = preview ? { success: true } : await submitHouseholdRsvp(validation.data);
      if (result.success) { setDone(true); requestAnimationFrame(() => successRef.current?.focus()); }
      else { setError(result.error ?? 'Your responses could not be saved.'); requestAnimationFrame(() => errorRef.current?.focus()); }
    } catch { setError('Your responses could not be saved. Your choices are still here. Please try again.'); }
    finally { setBusy(false); }
  }
  if (done) return <section className={styles.success} aria-live="polite">
    <h2 ref={successRef} tabIndex={-1}>{preview ? 'Preview complete.' : 'Thank you for replying.'}</h2>
    <p>{preview ? 'Nothing was submitted or emailed. These are fictional responses.' : 'Your household’s responses have been saved. You can return with the same invitation code to update them.'}</p>
    {data.members.map(member => <div className={styles.summary} key={member.id}><h3>{member.name}</h3><ul>
      {reply.guests.find(g => g.id === member.id)?.answers.map(answer => <li key={answer.eventId}>
        {data.events.find(e => e.id === answer.eventId)?.name_en}: {answer.status === 'accepted' ? 'Attending' : 'Unable to attend'}
      </li>)}
    </ul></div>)}
    <button className={styles.button} type="button" onClick={() => setDone(false)}>{preview ? 'Edit preview responses' : 'Edit responses'}</button>
  </section>;
  return <form onSubmit={submit} noValidate aria-busy={busy} className={styles.reply}>
    <p className={styles.formIntro}>Please answer for each person below. You can choose different celebrations and dietary details for every member of your household.</p>
    {data.members.map(member => {
      const guest = reply.guests.find(g => g.id === member.id)!;
      return <section key={member.id} className={styles.member} aria-labelledby={`${member.id}-heading`}>
        <h2 id={`${member.id}-heading`}>{member.name}</h2>
        <div className={styles.memberAnswers}>
          {data.events.map(event => <fieldset className={styles.event} key={event.id} disabled={busy}>
            <legend>{event.name_en}<span>{new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(event.event_date))}</span></legend>
            <div className={styles.choices}>{(['accepted', 'declined'] as const).map(status => <label key={status}>
              <input type="radio" name={`${member.id}-${event.id}`} checked={guest.answers.find(a => a.eventId === event.id)?.status === status}
                onChange={() => updateAnswer(member.id, event.id, status)} value={status} />
              {status === 'accepted' ? 'Attending' : 'Unable to attend'}
            </label>)}</div>
          </fieldset>)}
          <label className={styles.diet} htmlFor={`${member.id}-diet`}>Dietary requirements <span>Optional · allergies or other requirements</span></label>
          <textarea id={`${member.id}-diet`} rows={3} maxLength={500} value={guest.dietaryRequirements} disabled={busy}
            onChange={e => setReply(current => ({ guests: current.guests.map(g => g.id === member.id ? { ...g, dietaryRequirements: e.target.value } : g) }))} />
          <p className={styles.note}>Dietary notes are saved for guests attending at least one celebration.</p>
        </div>
      </section>;
    })}
    {error && <p ref={errorRef} tabIndex={-1} className={styles.error} role="alert">{error}</p>}
    <div className={styles.submitRow}><p>Check everyone’s choices before replying. You can return to update your responses.</p>
      <button className={styles.button} type="submit" disabled={busy}>{busy ? 'Saving responses…' : preview ? 'Preview household reply' : 'Save household responses'}</button></div>
    <p className={styles.note} role="status" aria-live="polite">{busy ? 'Saving your household’s responses. Please wait.' : ''}</p>
  </form>;
}
