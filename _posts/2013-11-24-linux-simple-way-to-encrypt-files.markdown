---
layout: post
status: publish
published: true
title: Linux - Simple way to encrypt files
date: '2013-11-24 22:11:51 -0800'
date_gmt: '2013-11-25 06:11:51 -0800'
categories:
- Administration
tags:
- linux
- openssl
- ssl
- rsa
- asymmetric
- symmetric
- private key
- pem
- public key
- encryption
- decryption
comments: true
---
<p>I found out an easy way to encrypt files on your Linux server, without encrypting the whole drive or using a program to do that work for you.  All you need to do is make an asymmetric rsa private key (keep this secure) and then a symmetric key during the session to encrypt a file.</p>

{% highlight bash %}
#build an asymmetric private key (RSA)
openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 -keyout myprivatekey.pem -out myprivatekey.pem #10 years or 3650 days may be bad for a private key

#now to encrypt a file run this:
openssl smime -encrypt -binary -aes256 -in myplaintextfile.txt -out myplaintextfile.txt.ssl -outform DER myprivatekey.pem

#now to decrypt a file run this:
openssl smime -decrypt -binary -in myplaintextfile.txt.ssl -inform DER -out myplaintextfile.txt -inkey myprivatekey.pem
{% endhighlight %}

<p>I would think this is useful for quick encryption of data, maybe you'd rather encrypt your files before sending them to S3, dropbox, etc.. Or you are just paranoid and have your private key on a usb drive and the encrypted files on a separate drive.  Either way I think this is a neat little function to use for basic encryption.</p>
