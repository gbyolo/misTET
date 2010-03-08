<h2>Admin Module Panel</h2>

Ho deciso di implementere un piccolo modulo per l'admin del sito web, in
js e php. Per primo e' importante il file admin.php, contiene la password
da utilizzare, quindi modificare la linea

/* Inserisci qui la tua password */
	define("PASSWORD", "meg");

con la propria password. Inoltre, all'interno del file admin.js, c'e'
la seguente riga:

/* md5 della password, usa: Admin/admin.php?crypt&string=password */
		passHash: "35623e2fb12281ddb6d7d5f63c5a29e3",

La variabile passHash al momento contiene la stringa criptata in md5 della
parola "meg" (stessa usata in admin.php), e dovrete modificarla con la 
vostra password. Per criptare velocemente, come dice il commento, recatevi
in Admin/admin.php?crypt&string=vostraPassword. Ovviamente la password
criptata inserita nel file .js deve essere la stessa del file .php, 
altrimenti il login non avviene.

<h2>Uso</h2>
Tramite questo (stupido) (demente) pannello(?) admin, sara' possibile
editare i file menu.xml e pagine.xml. Recatevi in home/admin tramite il
menu, il modulo tentera' il login con la password, e in caso avvenga con
successo, mostra il menu, altrimenti no. Ovviamente ogni altra funzione
effettua il controllo attraverso admin.php?logged, che indica se la 
sessione di login e' stata gia' definita. 
