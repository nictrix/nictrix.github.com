---
layout: post
title: Ruby - rbnacl - crypto library uses
description: "My uses of the rbnacl gem"
categories:
- Development
tags:
- ruby
- encryption
- decryption
- security
- cryptography
- rbnacl
- nacl
- mutual authentication
- private
- public
- keys
- base64
---
<p>I stumbled upon a really interesting Ruby Cryptography library that uses NaCl library, but I won't explain it here; just go to the <a href="https://github.com/cryptosphere/rbnacl" title="Github page">Github page</a> for more details.</p>
<p>I decided to use it for mutual authentication, which has been done, but with different mathematical algorithms.  RbNaCl does this by using private and public keys between 2 things like people, client/server, etc...  Below I will show how to create a client key and a server key then decrypt a message from the client to the server.</p>
<p>Let's first create the keys for the shell client.</p>

{% highlight ruby %}
require 'rbnacl'
require 'base64'

shell_private_key = RbNaCl::PrivateKey
shell_private_key = shell_private_key.generate
shell_public_key = shell_private_key.public_key
shell_public_key_base64 = Base64.urlsafe_encode64(shell_public_key.to_bytes)
{% endhighlight %}

<p>Create the keys for the server client</p>

{% highlight ruby %}
server_private_key = RbNaCl::PrivateKey
server_private_key = server_private_key.generate
server_public_key = server_private_key.public_key
server_public_key_base64 = Base64.urlsafe_encode64(server_public_key.to_bytes)
{% endhighlight %}

<p>Encrypt a message from the client</p>

{% highlight ruby %}
shell_box = RbNaCl::Box.new(Base64.urlsafe_decode64(server_public_key_base64), shell_private_key)
shell_nonce = RbNaCl::Random.random_bytes(shell_box.nonce_bytes)
shell_nonce_base64 = Base64.urlsafe_encode64(shell_nonce)

shell_message = "This is a valid message from the client"

shell_ciphertext = shell_box.encrypt(shell_nonce, shell_message)
shell_ciphertext_base64 = Base64.urlsafe_encode64(shell_ciphertext)
{% endhighlight %}

<p>Server needs to decrypt the message from the client</p>

{% highlight ruby %}
server_box = RbNaCl::Box.new(Base64.urlsafe_decode64(shell_public_key_base64), server_private_key)
shell_decrypted_message = server_box.decrypt(Base64.urlsafe_decode64(shell_nonce_base64), Base64.urlsafe_decode64(shell_ciphertext_base64))

puts "Valid message from client"
puts shell_decrypted_message
{% endhighlight %}

<p>3 things to note:<br />
1. The nonce is special and needs to stay random, do not use the same nonce for new messages as that will, according to the documentation make the cryptography weak.<br />
2. I'm using base64 to be able to export and import private and public keys, as you cannot send over raw bytes to the server or client, so you need to give them some ascii to decode to use the server's public key.<br />
3. I tried to see if there was a file size limit and got up to 100MBs with no issue in encrypting the file and decrypting it later. I didn't go higher as I had no use, but I didn't see any limits on how large of a file you can encrypt.</p>
<p>Here's how you can keep the same private key instead of generating a new one each time:</p>

{% highlight ruby %}
shell_key = "kPeIKHWcKqX2baXdoA8GO-8fDVBE_9qnRQn-IbcKd6E="
shell_private_key = RbNaCl::PrivateKey.new(Base64.urlsafe_decode64(shell_key))
{% endhighlight %}
