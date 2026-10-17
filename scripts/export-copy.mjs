/**
 * Exports all website copy (src/i18n/*.json and the legal Markdown pages) to a Word
 * document for copywriter review: Czech and English side by side, grouped by page.
 *
 *   npm run copy:export [-- output.docx]
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import {
  AlignmentType, BorderStyle, Document, Footer, HeadingLevel, LevelFormat, Packer, PageNumber,
  PageOrientation, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx';

const out = process.argv[2] ?? 'w4h-copy-review.docx';
const cs = JSON.parse(fs.readFileSync('src/i18n/cs.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
const notes = JSON.parse(fs.readFileSync('scripts/copy-review-notes.json', 'utf8'));
const today = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date());
let version = '';
try { version = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch {}

// ── Layout: A4 landscape, 0.6" margins ────────────────────────────────────────
const PAGE = { width: 11906, height: 16838 };
const MARGIN = 864;
const CONTENT = PAGE.height - 2 * MARGIN; // landscape: the long side is the width
const COLS = [3000, 4900, 4900, 2310];
const FONT = 'Arial';
const INK = '1F2937';
const MUTED = '6B7280';
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' };
const borders = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

// ── Sections of the site, in reading order ────────────────────────────────────
const parts = [
  {
    title: 'Shared across all pages',
    sections: [
      ['header', 'Header', 'Top of every page.'],
      ['nav', 'Main menu', 'Header menu; also used in the footer.'],
      ['common', 'Shared texts', 'Button labels and sample data used in several places.'],
      ['vitals', 'Vital sign labels and units', 'Short tags and units next to measured values. {value} is replaced by the number.'],
      ['breadcrumb', 'Breadcrumb', 'Small path above the heading on solution and legal pages.'],
      ['legalPage', 'Legal pages', 'Line at the end of each legal page. {date} is replaced by the date.'],
      ['footer', 'Footer', 'Bottom of every page.'],
    ],
  },
  {
    title: 'Home page',
    sections: [
      ['meta', 'Search results and link previews', 'Title and description shown by Google and when the link is shared.'],
      ['hero', 'Hero', 'First screen of the home page.'],
      ['facts', 'Figures', 'Row of three numbers under the hero.'],
      ['why', 'Why W4H', ''],
      ['solutions', 'Solutions', 'Three cards on the home page; the same cards appear as “Other W4H solutions” on each solution page.'],
      ['how', 'How it works', 'Four steps; also on every solution page.'],
      ['rhythm', 'Every 15 minutes', 'Interactive chart of sample readings. {placeholders} are filled in with times and values.'],
      ['devices', 'Devices', 'Also on every solution page.'],
      ['trust', 'Trust strip', 'Row of four facts; also on every solution page.'],
      ['contact', 'Demo request form', 'Bottom of the home page and of every solution page.'],
    ],
  },
  {
    title: 'Solution pages',
    sections: [
      ['details.hospital', 'W4H Hospital', 'Page /nemocnice/ (EN /en/hospital/). The page heading is the product name from the Solutions cards.'],
      ['details.clinic', 'W4H Clinic', 'Page /ambulance/ (EN /en/clinic/).'],
      ['details.homeCare', 'W4H Home & Long Term Care', 'Page /domaci-a-dlouhodoba-pece/ (EN /en/home-and-long-term-care/).'],
    ],
  },
];
const legalPages = [
  ['privacy', 'Privacy policy', 'Page /ochrana-osobnich-udaju/ (EN /en/privacy-policy/).'],
  ['legal', 'Legal information', 'Page /pravni-informace/ (EN /en/legal-information/).'],
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

/** Leaf strings of a dictionary branch as [path, value] pairs. */
function leaves(node, prefix = []) {
  if (typeof node === 'string') return [[prefix, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, [...prefix, i]));
  return Object.entries(node).flatMap(([k, v]) => leaves(v, [...prefix, k]));
}

/** Where the text shows up, so the copywriter knows how it is read. `path` is the full key path. */
function kind(path) {
  const last = String(path[path.length - 1]);
  if (path[0] === 'meta' || /^meta(Title|Description)$/.test(last)) return 'Search result / link preview';
  if (/alt$/i.test(last) || path.includes('alt')) return 'Image description (alt text)';
  if (last === 'placeholder') return 'Example text inside an empty field';
  if (last === 'error') return 'Form error message';
  if (last === 'label' && path[0] === 'contact') return 'Visible text';
  if (/Label$|^label$|^skipLink$|^menu(Open|Close)$/.test(last)) return 'Screen readers only';
  return 'Visible text';
}

const label = (path) =>
  path.map((p) => (typeof p === 'number' ? `#${p + 1}` : p.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase())).join(' › ');

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: 18, color: INK, ...opts });

function cell(children, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children,
    ...opts,
  });
}

const textParas = (text, opts) => String(text).split('\n').map((line) => new Paragraph({ children: [run(line, opts)] }));

function headerRow() {
  const shading = { fill: 'E6F1FB', type: ShadingType.CLEAR, color: 'auto' };
  return new TableRow({
    tableHeader: true,
    children: ['Where', 'Czech', 'English', 'Comments / approved'].map((h, i) =>
      cell([new Paragraph({ children: [run(h, { bold: true })] })], COLS[i], { shading }),
    ),
  });
}

function table(rows) {
  return new Table({
    width: { size: CONTENT, type: WidthType.DXA },
    columnWidths: COLS,
    rows: [
      headerRow(),
      ...rows.map(({ where, hint, csText, enText }) =>
        new TableRow({
          cantSplit: true,
          children: [
            cell([
              new Paragraph({ children: [run(where, { size: 16, color: MUTED })] }),
              ...(hint ? [new Paragraph({ children: [run(hint, { size: 16, italics: true, color: MUTED })] })] : []),
            ], COLS[0]),
            cell(textParas(csText), COLS[1]),
            cell(textParas(enText), COLS[2]),
            cell([new Paragraph({ children: [] })], COLS[3]),
          ],
        }),
      ),
    ],
  });
}

const heading = (text, level) => new Paragraph({ heading: level, children: [new TextRun({ text, font: FONT })] });
const note = (text) => new Paragraph({ spacing: { after: 120 }, children: [run(text, { color: MUTED, size: 18 })] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: [run(text, { size: 20 })] });

/** Markdown (legal pages) → list of { type, text } blocks: headings, paragraphs, list items. */
function markdownBlocks(file) {
  const md = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?---\n/, '');
  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => (/^(mailto|tel):/.test(href) || text.includes(href.replace(/^https?:\/\//, '')) ? text : `${text} [link]`))
    .replace(/<br\s*\/?>\n?/g, '\n');
  const blocks = [];
  for (const chunk of md.trim().split(/\n{2,}/)) {
    if (/^#{2,3} /.test(chunk)) blocks.push({ type: chunk.startsWith('### ') ? 'Subheading' : 'Heading', text: inline(chunk.replace(/^#+ /, '')) });
    else if (/^- /m.test(chunk)) chunk.split('\n').forEach((li) => blocks.push({ type: 'List item', text: inline(li.replace(/^- /, '')) }));
    else blocks.push({ type: 'Paragraph', text: inline(chunk) });
  }
  return blocks;
}
const frontmatter = (file) => Object.fromEntries(
  [...fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1].matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2]]),
);

// ── Document ──────────────────────────────────────────────────────────────────
const children = [
  new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: 'W4H website – copy for sign-off', font: FONT })] }),
  note(`Exported ${today}${version ? ` from version ${version}` : ''} · Live site: https://etylsarin.github.io/w4h/ (Czech) and /w4h/en/ (English)`),

  heading('How to review', HeadingLevel.HEADING_1),
  bullet('Each table row is one piece of text on the website, in Czech and English. The “Where” column says which part of the page it belongs to and how it is used.'),
  bullet('Write corrections or “OK” in the last column, or edit the Czech or English text directly with Track Changes on.'),
  bullet('Keep anything in {curly braces}, such as {value} or {date}: the website replaces it with a number, date or link.'),
  bullet('Image descriptions and screen-reader texts are not visible on the page, but they are read aloud to blind visitors and help search engines.'),
  bullet('Search titles should stay under about 60 characters and descriptions under 160, or Google will cut them off.'),

  heading('Please confirm', HeadingLevel.HEADING_1),
  note('These points depend on facts we could not verify ourselves.'),
  ...notes.confirm.map(bullet),

  heading('SEO suggestions for the copy', HeadingLevel.HEADING_1),
  note('From a check of all pages. The technical side (titles, descriptions, headings, image descriptions, sitemap, language versions) is already in order; these are about the wording.'),
  ...notes.seo.map(bullet),
];

for (const part of parts) {
  children.push(heading(part.title, HeadingLevel.HEADING_1));
  for (const [key, title, description] of part.sections) {
    children.push(heading(title, HeadingLevel.HEADING_2));
    if (description) children.push(note(description));
    const rows = leaves(get(cs, key)).map(([path, csText]) => ({
      where: label(path),
      hint: kind([...key.split('.'), ...path]),
      csText,
      enText: get(en, [key, ...path].join('.')) ?? '(missing)',
    }));
    children.push(table(rows));
  }
}

children.push(heading('Legal pages', HeadingLevel.HEADING_1));
children.push(note('Proposed texts; please have them checked by a lawyer as well. Links are marked [link].'));
for (const [page, title, description] of legalPages) {
  const csFile = `src/content/legal/cs/${page}.md`;
  const enFile = `src/content/legal/en/${page}.md`;
  const [csBlocks, enBlocks] = [markdownBlocks(csFile), markdownBlocks(enFile)];
  const [csMeta, enMeta] = [frontmatter(csFile), frontmatter(enFile)];
  children.push(heading(title, HeadingLevel.HEADING_2), note(description));
  const rows = [
    { where: 'page title', hint: 'Visible text', csText: csMeta.title, enText: enMeta.title },
    { where: 'description', hint: 'Search result / link preview', csText: csMeta.description, enText: enMeta.description },
    ...Array.from({ length: Math.max(csBlocks.length, enBlocks.length) }, (_, i) => ({
      where: `${(csBlocks[i] ?? enBlocks[i]).type.toLowerCase()} ${i + 1}`,
      hint: '',
      csText: csBlocks[i]?.text ?? '',
      enText: enBlocks[i]?.text ?? '',
    })),
  ];
  children.push(table(rows));
}

// Text drawn inside illustrations: Czech file and its English copy (*-en.svg), paired in order.
const illustrations = [
  ['ui-virtual-ward-tablet', 'Virtual ward (tablet)', 'Home page, How it works, W4H Hospital.'],
  ['ui-ecg-report-tablet', 'ECG recording (tablet)', 'W4H Clinic.'],
  ['ui-patient-app-phone', 'Patient app (phone)', 'Solutions cards, W4H Clinic.'],
  ['seal-mdr-ring', 'MDR seal', 'Hero of the home page; the text runs around the badge.'],
];
const svgTexts = (file) => [...fs.readFileSync(file, 'utf8').matchAll(/<(?:text|textPath)\b[^>]*>([^<]+)</g)]
  .map((m) => m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
children.push(heading('Text inside illustrations', HeadingLevel.HEADING_1));
children.push(note('Each illustration has a Czech and an English version. Names, numbers and times that are the same in both languages are left out, and values that differ only in the number are listed once. Changes here need the image files to be edited.'));
for (const [name, title, description] of illustrations) {
  const csTexts = svgTexts(`src/assets/img/${name}.svg`);
  const enTexts = svgTexts(`src/assets/img/${name}-en.svg`);
  const seen = new Set();
  const rows = csTexts
    .map((csText, i) => ({ csText, enText: enTexts[i] }))
    // one row per wording: "38,4 °C" and "36,5 °C" differ only in the digits
    .filter(({ csText, enText }) => csText !== enText && !seen.has(csText.replace(/\d+/g, '#')) && seen.add(csText.replace(/\d+/g, '#')))
    .map((row, i) => ({ where: `text ${i + 1}`, hint: '', ...row }));
  children.push(heading(title, HeadingLevel.HEADING_2), note(description), table(rows));
}

const doc = new Document({
  creator: 'W4H website',
  title: 'W4H website – copy for sign-off',
  styles: {
    default: { document: { run: { font: FONT, size: 20 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { size: 40, bold: true, font: FONT, color: '111827' }, paragraph: { spacing: { after: 120 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font: FONT, color: '111827' }, paragraph: { spacing: { before: 360, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT, color: '1E67BA' }, paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 1, keepNext: true } },
    ],
  },
  numbering: {
    config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }],
  },
  sections: [{
    properties: {
      page: { size: { width: PAGE.width, height: PAGE.height, orientation: PageOrientation.LANDSCAPE }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [run('W4H copy for sign-off · page ', { size: 16, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }), run(' of ', { size: 16, color: MUTED }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTED })],
        })],
      }),
    },
    children,
  }],
});

fs.writeFileSync(out, await Packer.toBuffer(doc));
console.log(`Wrote ${out}`);
