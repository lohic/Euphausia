Euphausia
=========

Code pour le projet Euphausia

+ Node.js
+ Flash
+ ATCOMMAND
+ Piratebox


*** http://lookingfora.name/2012/12/08/raspberry-pi-creer-un-point-dacces-wifi-avec-portail-captif/

reintialiser la config reseau :
`sudo /etc/init.d/networking restart`


http://blog.rueedlinger.ch/2013/03/raspberry-pi-and-nodejs-basic-setup/


---
Tout est dans le dossier `euphausia-server`

il faut arriver à installer un node.js sur le raspberryPI
il faudra également installer les librairies node suivantes :
- npm
- express (http://expressjs.com/guide.html)
- socket.io (http://socket.io)

le serveur se démarre avec la commande suivante (quand on est dans le dossier correspondant) :
`node server.js`

Il est configuré pour fonctionner sur l'URL 127.0.0.1:8333

L'idéal seait de réussir à faire fonctionner un réseau wifi,
avec un système DNS qui dirige automatiquement vers le serveur node,
quel que soit l'adresse rentrée.

