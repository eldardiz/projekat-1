IPI Akademija – Web projekat (HTML, CSS, JavaScript)

Ovaj projekat je urađen za predmet Web programiranje.
Početna verzija stranice preuzeta je sa Moodle-a, a zatim sam je redizajnirao, proširio i dodao sve funkcionalnosti koje se traže u uputama.

Cilj je bio da stranica izgleda modernije, da bude pregledna, te da sve nove stranice (Student Fun Zone alati) rade unutar jednog frameworka bez otvaranja novih tabova.

📌 Stranice u projektu

index.html – početna stranica

popis.html – popis kurseva

raspored.html – raspored kurseva

kontakt.html – kontakt forma sa validacijama + mailto

studentfunzone.html – ulazna stranica za sve mini aplikacije

Student Fun Zone sadrži 5 funkcionalnih alata:

Bingo (bingo.html)

Kviz (kviz.html)

Whiteboard (whiteboard.html)

Vision Board (vision-board.html)

Kanban Board (kanban-board.html)

Sve stranice otvaraju se unutar glavnog layou­ta pomoću <iframe> elementa, kako je zadatak i tražio.

🎨 Redizajn stranice

Originalna verzija stranice dosta je zastarjela, pa sam:

promijenio kompletan layout,

dodao header u dva reda (logo + linkovi),

uredio navigation bar i dropdown meni,

prilagodio sve boje i fontove,

poboljšao raspored elemenata,

dodao slike i vizuelne elemente u Student Fun Zone sekciji.

CSS je prilagođen da izgleda modernije i da sve stranice budu ujednačene.

🧩 Funkcionalnosti po zadatku

✔ “Snimi kao PDF”

Dodano na:

Bingo – printa samo Bingo tablu, a ne cijelu stranicu

Kanban – snima prikaz ploče kao PNG

Whiteboard – snimanje crteža kao PNG

Vision Board – snimanje i vraćanje elemenata preko localStorage

Kviz – nema PDF, ali ima overlay za savršen rezultat

✔ “Pošalji mailom”

Na kontakt stranici urađena je mailto funkcionalnost, uz validaciju:

email mora imati “@”

telefon mora biti broj

polja ne mogu biti prazna

Klik na “Pošalji” otvara mail klijent sa popunjenim podacima.

✔ Student Fun Zone – dropdown meni

Dropdown se otvara na hover i pravilno se ponaša.
Sve mini aplikacije otvaraju se unutar glavnog layouta.

✔ Manipulacija DOM-a i JavaScript funkcionalnosti

Bingo ćelije, provjera pobjede, modal…

Kviz sa automatskim bodovanjem

Whiteboard sa canvas crtanjem

Vision Board sa drag & drop funkcijama

Kanban sa povlačenjem zadataka između kolona

✔ LocalStorage

Vision board i Kanban koriste localStorage za spremanje stanja.

📁 Struktura projekta
/css
/js
/slike
index.html
popis.html
raspored.html
kontakt.html
studentfunzone.html
bingo.html
kviz.html
whiteboard.html
vision-board.html
kanban-board.html
README.md

▶️ Kako pokrenuti projekat
git clone https://github.com/eldardiz/projekat-1.git
