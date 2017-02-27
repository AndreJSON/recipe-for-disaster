#Frontend:
AngularJS + Angular Material Design
#Backend:
NodeJS + Express
#Databas:
Postgres (Antagligen Sequelize.js för kommunikationen)

#Beskrivning:
En webbsida för att dela med sig av recept. En användare kan publicera och redigera sina egna recept samt kommentera på andras recept. En sökfunktion kommer att finnas för att kunna hitta andras recept. Den påtänkta arkitekturen för sidan är i nuläget:

En startsida där sökningar kan göras och där möjlighet finns att logga in genom att klicka på en knapp och få upp en modal.

En annan knapp kan öppna en modal för att skapa ett nytt recept.

En sida med sökresultat där man kan klicka på det recept man vill se.

En sida för att visa ett specifikt recept. Här kan man även skriva kommentarer samt redigera receptet om man är dess skapare.

#Databasens innehåll:

##User
id		    (serial)
name		(text)
hash		(text)
salt		(text)

##Recipe
id		    (serial)
author		(int)
name		(text)
image		(text)
freetext	(text)
createdAt	(timestamp)
updatedAt	(timestamp)
tags		(text[ ])

##Comment
id          (serial)
recipeId    (int)
author 		(int)
freetext	(text)
createdAt	(timestamp)
updatedAt	(timestamp)

