# How to certificate a local server

1. Open a terminal window
2. run `sudo mkdir -p /private/etc/ssl/private`
3. run `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/node-selfsigned.key -out /etc/ssl/certs/node-selfsigned.crt`

- This creates self-signed SSL certificates for an HTTPS server when running the server locally. These are required for the spotify Oauth.

4. The terminal will ask you for some information. Make sure the common name is set to `localhost:8443`

5. Place these keys in the sslcerts map in the project
