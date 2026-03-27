import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload } from 'lucide-react';
import { COLORS } from '@/constants/theme.constants';
import { SESSIONS } from '@/constants/mock.data';

// ─── Data types ────────────────────────────────────────────────
interface CalendarEvent {
  letter?: string;
  title: string;
  dateRange: string;
  bold?: boolean;
  indented?: boolean;
}
interface CalendarSection {
  title: string;
  events: CalendarEvent[];
}
interface CalendarData {
  heading: string;
  subtitle: string;
  category: string;
  sections: CalendarSection[];
  footer: string[];
  signatory: { name: string; title: string };
}

// ─── Mock academic calendar data ─────────────────────────────
const CALENDAR_DATA: Record<string, CalendarData> = {
  '2025/2026': {
    heading: 'ACADEMIC CALENDAR FOR 2025/2026 SESSION (NEW AND RETURNING STUDENTS)',
    subtitle: 'Academic Calendar for 2025/2026 Session (New and Returning Students)',
    category: 'UNDERGRADUATE STUDENTS',
    sections: [
      {
        title: 'First Semester',
        events: [
          { letter: 'a.', title: 'Commencement of online Registration for New Students',                                                                            dateRange: 'Mon. 19/01/26'                            },
          { letter: 'b.', title: 'Virtual Orientation for New Students',                                                                                             dateRange: 'Mon. 19/01/26 –\nTue. 20/01/26'           },
          { letter: 'c.', title: '5 weeks for Virtual Lectures',                                                                                                     dateRange: 'Wed. 21/01/26 –\nFri. 27/02/26'           },
          { letter: 'd.', title: 'Physical Resumption for New Students',                                                                                             dateRange: 'Mon. 02/03/26'                            },
          { letter: 'e.', title: 'Physical Orientation for New Students',                                                                                            dateRange: 'Tue. 03/03/26 –\nWed. 04/03/26'           },
          { letter: 'f.', title: 'Physical Resumption on campus for Returning Students/ Commencement of online Registration for Returning Students',                 dateRange: 'Thur. 05/03/26'                           },
          { letter: 'g.', title: 'Matriculation Ceremony (Physical)',                                                                                                dateRange: 'Wed. 11/03/26', bold: true                },
          { letter: 'h.', title: '11 weeks for Teaching/Revision and Continuous Assessment',                                                                         dateRange: 'Mon. 09/03/26 –\nFri. 22/05/26'           },
          { letter: 'i.', title: 'GES Examinations',                                                                                                                dateRange: 'Mon. 25/05/26 –\nFri. 29/05/26'           },
          { letter: 'j.', title: '2 weeks for Examinations in the Faculties of Education, Pharmaceutical Sciences, Technology, Law, Agriculture, Renewable Natural Resources,\nClinical Sciences, Dentistry, Basic Medical Sciences, Public Health, Environmental Design and Management, Basic Clinical Sciences, and Nursing', dateRange: 'Mon. 01/06/26 –\nFri. 12/06/26' },
          { letter: 'k.', title: '2 weeks for Examinations in the Faculties of Arts, Science,\nthe Social Sciences, Economics & Management Sciences, Veterinary Medicine, and Computing', dateRange: 'Mon. 15/06/26 –\nFri. 26/06/26' },
        ],
      },
      {
        title: 'Second Semester',
        events: [
          { letter: 'a.', title: '11 Weeks for Teaching/Revision and Continuous Assessment',                       dateRange: 'Mon. 13/07/25 – Fri.\n09/10/26'           },
          { letter: 'b.', title: '2 weeks for the processing of First Semester Examination Results',                dateRange: 'Mon. 03/08/26 – Fri.\n14/08/26'           },
          { letter: 'c.', title: '2 weeks for meetings of Faculty Boards of Examiners to consider First Semester Non-Final Year Results', dateRange: 'Mon. 17/08/26 – Fri.\n28/08/26' },
          { letter: 'd.', title: 'Senate Meeting for the consideration of First Semester Non-Final Year Results',   dateRange: 'Tue. 15/09/26 – Wed.\n16/09/26'           },
          { letter: 'e.', title: 'GES Examinations',                                                               dateRange: 'Mon. 12/10/26 – Fri.\n16/10/26'           },
          { letter: 'f.', title: '2 weeks for Examinations in the Faculties of Education, Pharmaceutical Sciences, Technology, Law, Agriculture, Renewable Natural Resources,\nClinical Sciences, Dentistry, Basic Medical Sciences, Public Health, Environmental Design and Management, Basic Clinical Sciences, and Nursing', dateRange: 'Mon. 19/10/26 – Fri.\n30/10/26' },
          { letter: 'g.', title: '2 weeks for Examinations in the Faculties of Arts, Science,\nthe Social Sciences, Economics & Management Sciences, Veterinary Medicine, and Computing', dateRange: 'Mon. 02/11/26 – Fri.\n13/11/26' },
          { letter: 'h.', title: '2 weeks for the processing of Results',                                          dateRange: 'Mon. 16/11/26 – Fri.\n27/11/26'           },
          { letter: 'i.', title: '2 weeks for the meetings of Faculty Boards of Examiners',                        dateRange: 'Mon. 30/11/26 – Fri.\n11/12/26'           },
          { letter: '',   title: '(Final and Non-Final Year Results)',                                             dateRange: '', indented: true                         },
          { letter: 'j.', title: 'Senate meetings for the consideration of Final and Non-Final Year Results',       dateRange: 'Mon. 28/12/26 – Wed.\n30/12/26'           },
        ],
      },
    ],
    footer: [
      'Students arrive for Commencement of 2026/2027 Academic Session on Monday, 18/01/2027',
      'Postgraduate Students to resume along with the undergraduate students',
    ],
    signatory: { name: 'G.O. Saliu, fspsp, FNIM, FCIML, MANUPA, MAUA', title: 'Registrar and Secretary to Senate' },
  },
  '2024/2025': {
    heading: 'ACADEMIC CALENDAR FOR 2024/2025 SESSION (NEW AND RETURNING STUDENTS)',
    subtitle: 'Academic Calendar for 2024/2025 Session (New and Returning Students)',
    category: 'UNDERGRADUATE STUDENTS',
    sections: [
      {
        title: 'First Semester',
        events: [
          { letter: 'a.', title: 'Commencement of online Registration for New Students', dateRange: 'Mon. 20/01/25' },
          { letter: 'b.', title: 'Virtual Orientation for New Students',                  dateRange: 'Mon. 20/01/25 –\nTue. 21/01/25' },
          { letter: 'c.', title: '5 weeks for Virtual Lectures',                          dateRange: 'Wed. 22/01/25 –\nFri. 28/02/25' },
          { letter: 'd.', title: 'Physical Resumption for New Students',                  dateRange: 'Mon. 03/03/25' },
          { letter: 'e.', title: 'Matriculation Ceremony (Physical)',                     dateRange: 'Wed. 12/03/25', bold: true },
          { letter: 'f.', title: '11 weeks for Teaching/Revision and Continuous Assessment', dateRange: 'Mon. 10/03/25 –\nFri. 23/05/25' },
          { letter: 'g.', title: 'GES Examinations',                                      dateRange: 'Mon. 26/05/25 –\nFri. 30/05/25' },
        ],
      },
      {
        title: 'Second Semester',
        events: [
          { letter: 'a.', title: '11 Weeks for Teaching/Revision and Continuous Assessment', dateRange: 'Mon. 14/07/25 –\nFri. 10/10/25' },
          { letter: 'b.', title: '2 weeks for the processing of First Semester Examination Results', dateRange: 'Mon. 04/08/25 –\nFri. 15/08/25' },
          { letter: 'c.', title: 'Senate Meeting for the consideration of First Semester Non-Final Year Results', dateRange: 'Tue. 16/09/25 –\nWed. 17/09/25' },
        ],
      },
    ],
    footer: [
      'Students arrive for Commencement of 2025/2026 Academic Session on Monday, 19/01/2026',
      'Postgraduate Students to resume along with the undergraduate students',
    ],
    signatory: { name: 'G.O. Saliu, fspsp, FNIM, FCIML, MANUPA, MAUA', title: 'Registrar and Secretary to Senate' },
  },
};

// ═══════════════════════════════════════════════════════════════
// ── PAGE ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
const AcademicCalendarPage = () => {
  const [session, setSession] = useState(SESSIONS[0]);
  const [sessionOpen, setSessionOpen] = useState(false);
  const sessionRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const data = CALENDAR_DATA[session] ?? CALENDAR_DATA['2025/2026'];

  const handleExport = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Academic Calendar ${session}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; font-size: 13px; color: #111; padding: 32px; line-height: 1.6; }
        h2 { font-size: 14px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.03em; }
        p  { margin: 2px 0; }
        table { width: 100%; border-collapse: collapse; margin: 0; }
        td { padding: 7px 10px; vertical-align: top; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        td:first-child { width: 28px; color: #6b7280; white-space: nowrap; padding-right: 4px; }
        td:last-child { text-align: right; white-space: pre-line; min-width: 150px; color: #6b7280; }
        .section-header td { font-weight: 700; font-size: 13px; background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 8px 10px; color: #111; }
        .bold-row td { font-weight: 700; color: #111; }
        .indented-row td:nth-child(2) { padding-left: 20px; color: #9ca3af; font-style: italic; }
        .footer-section { margin-top: 16px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
        .signatory { margin-top: 20px; }
        @media print { body { padding: 16px; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 250);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1100px]">
      {/* ── Controls row: right-aligned ── */}
      <div className="flex items-center justify-end gap-3">
        {/* Session dropdown */}
        <div className="relative" ref={sessionRef}>
          <button
            onClick={() => setSessionOpen(o => !o)}
            onBlur={() => setTimeout(() => setSessionOpen(false), 150)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white"
          >
            Current Session
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${sessionOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {sessionOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                style={{ transformOrigin: 'top' }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[140px] overflow-hidden"
              >
                {SESSIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSession(s); setSessionOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      session === s ? 'text-[#20A8D8] font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Export button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: COLORS.primary }}
        >
          Export <Upload size={14} />
        </motion.button>
      </div>

      {/* ── Calendar content card ── */}
      <motion.div
        key={session}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Printable content */}
        <div ref={printRef}>
          {/* Document heading block */}
          <div className="px-6 md:px-8 pt-6 pb-4 border-b border-gray-100">
            <h2
              className="font-bold text-xs md:text-sm uppercase tracking-wide leading-snug mb-1"
              style={{ color: COLORS.text.title }}
            >
              {data.heading}
            </h2>
            <p className="text-xs" style={{ color: COLORS.text.muted }}>{data.subtitle}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: COLORS.text.subtitle }}>
              {data.category}
            </p>
          </div>

          {/* Sections rendered as a single table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {data.sections.map((section, si) => (
                  <>
                    {/* Section header row */}
                    <tr key={`section-${si}`} className="bg-gray-50 border-t border-b border-gray-200">
                      <td
                        colSpan={3}
                        className="px-6 md:px-8 py-2.5 text-xs font-bold uppercase tracking-wide"
                        style={{ color: COLORS.text.title }}
                      >
                        {section.title}
                      </td>
                    </tr>

                    {/* Event rows */}
                    {section.events.map((event, ei) => (
                      <tr
                        key={`${si}-${ei}`}
                        className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                          event.bold ? 'font-semibold' : ''
                        }`}
                      >
                        {/* Letter */}
                        <td
                          className="pl-6 md:pl-8 pr-2 py-2.5 align-top text-gray-400 whitespace-nowrap select-none text-xs"
                          style={{
                            width: 40,
                            paddingLeft: event.indented ? '2.5rem' : undefined,
                          }}
                        >
                          {event.letter}
                        </td>

                        {/* Title */}
                        <td
                          className={`px-2 py-2.5 align-top leading-relaxed text-xs md:text-sm ${
                            event.indented ? 'pl-5 italic' : ''
                          }`}
                          style={{
                            color: event.bold
                              ? COLORS.text.title
                              : event.indented
                              ? COLORS.text.muted
                              : COLORS.text.subtitle,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {event.title}
                        </td>

                        {/* Date range */}
                        <td
                          className={`pr-6 md:pr-8 pl-4 py-2.5 align-top text-right whitespace-pre-line text-xs leading-relaxed ${
                            event.bold ? '' : 'text-gray-500'
                          }`}
                          style={{
                            minWidth: 130,
                            color: event.bold ? COLORS.text.title : undefined,
                          }}
                        >
                          {event.dateRange}
                        </td>
                      </tr>
                    ))}

                    {/* End of semester note (between sections) */}
                    {si < data.sections.length - 1 && (
                      <tr key={`end-${si}`} className="border-b border-gray-100">
                        <td colSpan={3} className="px-6 md:px-8 py-2 text-xs italic text-gray-400">
                          (End of {section.title})
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer notes + signatory */}
          <div className="px-6 md:px-8 py-5 border-t border-gray-100 flex flex-col gap-1">
            {data.footer.map((line, i) => (
              <p key={i} className="text-xs" style={{ color: COLORS.text.muted }}>
                {line}
              </p>
            ))}
            <div className="mt-5">
              <p className="text-xs font-semibold" style={{ color: COLORS.text.title }}>
                {data.signatory.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.text.muted }}>
                {data.signatory.title}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AcademicCalendarPage;
