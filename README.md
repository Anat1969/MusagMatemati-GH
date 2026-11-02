# מושג מתמטי

**[musag-matemati-gh.vercel.app](https://musag-matemati-gh.vercel.app)**
למיזוג האחרון, בלי Vercel: https://raw.githack.com/Anat1969/MusagMatemati-GH/main/app/index.html

כל בניין עונה על 3 שאלות: איך מחלקים, איך מחברים ואיך משתנים.
שישה מושגים מתמטיים, כל אחד עם כלל ממקור, שרטוט חי, תקדים אמיתי, דוגמה מהעיר, הייקו ופוסט. ומחולל למושג משלכם.

## הרצה
```
npm install
npm run dev
npm run build && node tests/e2e.cjs
```

## החלטות
- Vite, React ו-TypeScript, בלי ספריות UI. עיר המושגים והשרטוטים ב-SVG.
- ניתוב hash, כך שכל קישור פותח את אותו מצב.
- השרת הוא השרת של הגרסה המקורית ב-Lovable (Supabase), כדי שהמושגים שנוצרו שם יופיעו כאן.
- ההנחיות: CLAUDE.md, ו-https://github.com/Anat1969/Claude-GH
