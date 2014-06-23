---
layout: post
status: publish
published: true
title: Apache http whitelist multiple IP Addresses
date: '2013-11-20 18:24:55 -0800'
date_gmt: '2013-11-21 02:24:55 -0800'
categories:
- Administration
tags:
- apache
- mod_rewrite
- whitelist
- http
- load balancer
comments: true
---
<p>Here's a way to whitelist as many IP addresses as you want, using Apache rewrite module.</p>
<p>In the VirtualHost add this:</p>

{% highlight bash %}
<ifmodule mod_rewrite.c>
  RewriteEngine On
  RewriteMap ips txt:/etc/apache2/allowed_ips
  RewriteCond ${ips:%{HTTP:X-Forwarded-For}|NOT-FOUND} =NOT-FOUND
  RewriteCond ${ips:%{REMOTE_ADDR}|NOT-FOUND} =NOT-FOUND
  RewriteRule ^(.*)$ https://google.com [R,L]
</ifmodule>
{% endhighlight %}

<p>And this file is where you add the allowed IP addresses: /etc/apache2/allowed_ips</p>
<p>Contents:</p>

{% highlight bash %}192.168.1.45 -
192.168.1.47 -
{% endhighlight %}

<p>Any other IP addresses trying to access your apache website will be redirected to google, or you can put a forbidden page there too.  Just to note this setup is flexible enough to use a load balancer (X-Forwarded-For) or straight to the server (REMOTE_ADDR), no modification needed.</p>
