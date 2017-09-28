#!/bin/bash
# make directories to work from
mkdir -p certs/

# Create your very own Root Certificate Authority
openssl genrsa \
  -out certs/localhost.privkey.pem \
  2048

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req \
  -x509 \
  -new \
  -nodes \
  -key certs/localhost.privkey.pem \
  -days 1024 \
  -out certs/localhost.cert.pem \
  -subj "/C=US/ST=Oregon/L=Provo/O=Localhost Signing Authority Inc/CN=localhost"
