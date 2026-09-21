# Release Site Database

A working prototype of a release site register for a wildlife rescue and rehabilitation
group, built to replace a form-to-email-to-spreadsheet-to-map process with a single
system that holds the data once.

Everything in this repository runs locally with no accounts, no API keys and no hosted
services. All the data is fabricated.

## The problem it addresses

A volunteer coordinator receives release site applications through an online form. Each
one arrives as an email, which is then typed by hand into a shared spreadsheet, and the
same details are typed a second time into a map so the officers can see where the
properties are. Ten release officers work from a copy of that spreadsheet and assign
rehabilitation jobs to properties as animals become ready.

The data is entered twice, the map drifts out of step with the spreadsheet, and there is
no single record of which animals went where.

## What the prototype does

**Application form** at `/apply`. The questions a landholder answers about their property:
size, habitat, species they can take, fencing, dogs, permanent water and availability.
Submitting writes one record.

**Release Site Database** at `/sites`. The officers' view, filterable by suburb, species
and status. This is the spreadsheet, except there is one of it and it is always current.

**Map** at `/map`. Every site drawn from the same records, coloured by status. Nothing is
copied across, so it cannot fall behind.

**Site record** at `/sites/[ref]`. Everything known about one property, with the panel
where an officer assigns a rehabilitation job: species, number of animals, which officer,
target release date and handling notes. The job history sits underneath.

## Running it

```
npm install
npm run seed
npm run dev
```

Then open http://localhost:3111

`npm run seed` rebuilds the database from scratch with 24 release sites across South East
Queensland, 10 release officers and 15 rehabilitation jobs.

## Built with

Next.js with the App Router, SQLite through better-sqlite3, and Leaflet with OpenStreetMap
tiles. SQLite keeps the prototype self-contained; a production build of this would use a
hosted Postgres database so the officers can reach it from anywhere.

## About the data

Every name, address, email address and phone number in the seed data is invented. Email
addresses use `example.com`, which RFC 2606 reserves and which cannot belong to anyone.
Phone numbers use the `0491 570 xxx` range, which the Australian Communications and Media
Authority reserves for fiction. The suburbs and their coordinates are real places in South
East Queensland, chosen so the map looks like the area it represents.

Release site applications in the prototype are placed on the map from a lookup of suburb
centroids. A production build would geocode the street address properly.
