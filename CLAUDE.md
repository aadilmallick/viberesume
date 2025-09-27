This is a NextJS/typescript project called VibeResume, a nextJS app that lets logged in users upload their resume in PDF format, after which we'll extract the text from the pdf, hand it off to the AI to create a single-page, nicely designed portfolio (which is just an HTML + Tailwind + inline JS string stored in DB) hosted on our server under a randomly-initialized slug, like /sites/jhfadj-3434-sfs, and then users can then change that slug to a unique, more semantic slug like 'natalie-portfolio'.

Here are some rules I want you to follow when helping me build my app:

1. Use TailwindCSS and have nice design throughout
2. Keep any progress you made in a PROGRESS.md, list objectives there as todos and then strike them out as you go.
3. Use zod for type safety, especially in API routes, keep common types and interfaces
4. Use ShadCN

For nextJS specific stuff:

- Limit 'use client', basically use best practices with making things server components unless you need something to be a client component.
