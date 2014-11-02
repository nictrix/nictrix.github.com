---
layout: post
title: "Facebook's Mcrouter SSL Setup"
description: "How to setup Facebook's mcrouter open source project with SSL"
category:
  - Administration
tags:
  - facebook
  - mcrouter
  - memcached
  - linux
---
<p>
  Facebook released Mcrouter back on <a href="https://code.facebook.com/posts/296442737213493/introducing-mcrouter-a-memcached-protocol-router-for-scaling-memcached-deployments/">September 15th</a>, they went through what it does and how it helps Facebook and other companies. Most of the documentation is on the <a href="https://github.com/facebook/mcrouter/wiki">Github wiki page</a>, which has different types of setups, command line options and different supported features.  It's a really great tool when you have a ton of clients connecting to your cache layer and need to route them appropriately.
</p>

<p>
  One item they left off the documentation was SSL.  It was clear you needed SSL certificate, private key and the signing CA public key.  But wasn't clear was the implementation details and how the authentication between two Mcrouter's actually happened.  I will clear that up for you here.
</p>

<p>
  In Mcrouter authentication over SSL is certificate and IP based.  The private key and certificate need to be signed by a trusted CA that the other Mcrouters can validate against.  The certificate's alternative IP addresses need to match the IP address of the Mcrouter's server.  Below I will show you how to create a CA, Private Key and Certificate to use with Mcrouter. (remember each private key and certificate is unique to each mcrouter and what ip addresses you add to the SAN CSR)
</p>

<p>
  <b>Install the necessary dependencies</b>
  <br><br>
  RHEL/CentOS/Fedora:

  {% highlight bash %}
  yum install gnutls-utils
  {% endhighlight %}

  Debian/Ubuntu:

  {% highlight bash %}
  apt-get install gnutls-utils
  {% endhighlight %}
</p>

<p>
  <b>Create your CA private key and certificate (public key)</b>
  <br><br>
  CA Private Key:

  {% highlight bash %}
  certtool --generate-privkey --outfile ca-key.pem
  {% endhighlight %}

  CA Public Key (certificate):

  {% highlight bash %}
  certtool --generate-self-signed --load-privkey ca-key.pem --outfile ca.crt
  {% endhighlight %}

  <i>Answer all questions as default (press enter) except the ones below:</i>

  {% highlight bash %}
  Does the certificate belong to an authority? Y
  path length -1
  Will the certificate be used to sign other certificates? Y
  {% endhighlight %}

  CA Signing Configuration (ca_config.txt)

  {% highlight bash %}
  expiration_days = -1
  honor_crq_extensions
  {% endhighlight %}
</p>

<p>
  <b>Create your servers private key, csr and certificate</b>
  <br><br>
  Private Key:
  {% highlight bash %}
  certtool --generate-privkey --outfile my_server_private_key.pem
  {% endhighlight %}

  For the CSR it needs to be a SAN certificate, for that you need to create a configuration file (my_server_csr_san_config) to send with the command (change the country, state, locality, organization as you see fit):
  <br><br>
  {% highlight bash %}
  [req]
  default_bits = 2048
  default_keyfile = my_server_private_key.pem
  distinguished_name = req_distinguished_name
  req_extensions = v3_req

  [req_distinguished_name]
  countryName = US
  countryName_default = US
  stateOrProvinceName = California
  stateOrProvinceName_default = California
  localityName = Menlo Park
  localityName_default = Menlo Park
  organizationalUnitName  = Facebook
  organizationalUnitName_default  = Facebook
  commonName = my-mcrouter-server
  commonName_max  = 64

  [v3_req]
  basicConstraints = CA:FALSE
  keyUsage = nonRepudiation, digitalSignature, keyEncipherment
  subjectAltName = @alt_names

  [alt_names]
  DNS.1 = localhost
  IP.1 = 127.0.0.1
  IP.2 = <inbound ip address>
  {% endhighlight %}

  <i>Make sure to update <b>IP.2</b> with the IP address the server will be connecting with.  You can add more too; IP.3, IP.4, etc...</i>
  <br><br>
  CSR:

  {% highlight bash %}
  openssl req -new -out my_server.csr -key my_server_private_key.pem -config my_server_csr_san_config.txt -batch
  {% endhighlight %}

  Create and sign the server's certificate:

  {% highlight bash %}
  certtool --generate-certificate --load-request my_server.csr --outfile my_server.crt --load-ca-certificate ca.crt --load-ca-privkey ca-key.pem --template ca_config.txt`
  {% endhighlight %}
</p>

<p>
  <b>Use in the command line</b>

  {% highlight bash %}
  mcrouter --ssl-port 11433 --pem-cert-path=my_server.crt --pem-key-path=my_server_private_key.pem --pem-ca-path=ca.crt
  {% endhighlight %}
</p>

<p>
  Just an FYI, I did end up adding this to the GIthub wiki for Mcrouter.
</p>
