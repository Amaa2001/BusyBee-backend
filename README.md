# BusyBee-backend 
Backend API for the BusyBee task manager application.

Det finns flera olika typer av databaser som används beroende på vilken typ av data som ska lagras och hur applikationen fungerar.

SQL, Relationsdatabaser.
Relationsdatabaser lagrar data i tabeller med rader och kolumner. Tabeller kan kopplas ihop med relationer genom nycklar. Exempel på sådana databaser är MySQL, PostgreSQL och Microsoft SQL Server.
De används ofta i system där datan är strukturerad och där man behöver stark dataintegritet, till exempel banksystem eller affärssystem.

NoSQL, Dokumentdatabaser.
Dokumentdatabaser lagrar data i dokumentformat, ofta JSON eller BSON. Exempel är MongoDB. Dessa databaser är mer flexibla eftersom dokument inte behöver ha exakt samma struktur.
De används ofta i moderna webbapplikationer där data kan variera mycket och där utvecklingstakten är hög.

Key-value databaser
Denna typ lagrar data som nyckel-värde-par. Exempel är Redis. De används ofta för caching, sessionshantering och mycket snabba uppslag.



I detta projekt har jag valt att använda en Mongo databas som är klassiferat som dokumentdatabas.
MongoDB lagrar data i dokument som liknar JSON-format, vilket passar bra tillsammans med Node.js och JavaScript eftersom datamodellerna kan representeras på ett naturligt sätt i koden.
Ett alternativ hade varit att använda en relationsdatabas som PostgreSQL eller MySQL. Dessa databaser lagrar data i tabeller med fasta strukturer och relationer mellan tabeller.

En fördel med MongoDB i mitt projekt är flexibiliteten i datastrukturen. Eftersom jag lagrar tasks och användare kan jag enkelt ändra eller lägga till nya fält utan att behöva ändra hela databasschemat.

MongoDB fungerade bra eftersom datamodellen är relativt enkel och flexibiliten gjorde utvecklingen snabbare.



Om backendtjänsten skulle användas av en mycket stor publik skulle arkitekturen behöva designas för att hantera hög belastning, säkerställa hög tillgänglighet och bibehålla god prestanda.

En viktig åtgärd skulle vara att använda load balancing. En load balancer fördelar inkommande trafik mellan flera serverinstanser. Detta gör att systemet kan hantera fler användare samtidigt och minskar risken att en enskild server överbelastas.

För att undvika att requests tappas bort skulle man kunna använda message queues, till exempel RabbitMQ eller Kafka. Då kan requests läggas i en kö och bearbetas i tur och ordning, även om systemet är tillfälligt överbelastat.

För att förbättra responstiden kan man också använda caching, till exempel Redis, för att lagra ofta efterfrågad data i minnet istället för att alltid göra databasförfrågningar.

Dessa åtgärder tillsammans kan bidra till ett system som är skalbart, robust och kan hantera hög trafik utan att tappa requests.



Projektet är uppdelat i flera olika lager för att göra koden mer organiserad och lättare att underhålla.

Routes
Routes definierar API-endpoints, till exempel (/api/tasks) och (/api/auth). Dessa ansvarar för att ta emot HTTP-requests och vidarebefordra dem till rätt funktioner.

Controllers
Controllers innehåller logiken för hur en request ska hanteras. Här finns till exempel funktioner för att skapa, hämta, uppdatera och ta bort tasks.

Models
Models definierar datastrukturen i databasen genom Mongoose-scheman, till exempel hur en task eller användare ser ut.

Middleware
Middleware används för funktioner som körs innan en request når controllern, till exempel autentisering med JWT.

Denna struktur följer ett vanligt arkitekturmönster som liknar MVC (Model-View-Controller). I detta fall används dock endast Model och Controller eftersom projektet är ett API utan vylager.

Fördelen med denna struktur är att ansvaret i koden är tydligt uppdelat. Det gör det lättare att underhålla projektet, lägga till nya funktioner och arbeta i team eftersom varje del av systemet har en tydlig roll.



Det finns flera vanliga säkerhetshot mot webbapplikationer som identifieras i OWASP Top 10.

Injection-attacker
Injection sker när en angripare skickar skadlig kod till en applikation som sedan exekveras av databasen eller servern. Ett exempel är SQL-injection där angriparen manipulerar en databasfråga för att få tillgång till känslig information. Konsekvensen kan bli dataläckor eller att angriparen får full kontroll över databasen.

Broken Authentication
Det innebär att autentiseringssystemet är bristfälligt, vilket gör att angripare kan få tillgång till andra användares konton. Detta kan ske genom svaga lösenord, stulna sessioner eller dålig hantering av tokens. Konsekvensen kan bli att obehöriga får tillgång till privata data.



I mitt API har jag implementerat några säkerhetsåtgärder för att skydda användardata och systemet.
En viktig åtgärd är JWT-autentisering (JSON Web Token). När en användare loggar in genereras en token som sedan måste skickas med i varje request till skyddade endpoints. Detta gör att endast autentiserade användare kan komma åt API:et och skyddar mot obehörig åtkomst.

En annan åtgärd är lösenordshashning med bcrypt. Istället för att lagra lösenord i klartext hash-as de innan de sparas i databasen. Detta innebär att även om databasen skulle bli komprometterad kan angriparen inte direkt läsa användarnas lösenord.

En möjlig brist i den nuvarande implementationen är att rate limiting saknas. Utan rate limiting kan en angripare försöka logga in många gånger i rad (brute force attack). Med mer tid skulle vi implementera rate limiting, till exempel med biblioteket express-rate-limit, för att begränsa antalet requests per användare.



