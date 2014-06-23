---
layout: post
title: Linux - when you don't need a proxy
description: "Simple NAT routing with ipTables, when to not use apache or nginx"
categories:
- Administration
tags:
- network
- iptables
- linux
- proxy
- redirect
- port
- prerouting
- nat
comments: true
---
<p>I've seen many examples of people using apache/nginx/haproxy to proxy requests from 1 port to another just because it's not a privilege port, such as 80 or 443.  Both which are defaults for http and https for most web browsers.  The reasoning could be lack of knowledge, future use of the proxy server or being stubborn.</p>
<p>Below is an an example of how not to use a proxy server incase you are just moving requests from a privilege port 80 to 8080.  When this is all you need, without any extra redirecting or anything else then iptables is your friend.</p>

{% highlight bash %}
/sbin/iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
/sbin/iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
/sbin/iptables-save > /etc/sysconfig/iptables
chkconfig --level 35 iptables on
service iptables restart
{% endhighlight %}

<p>To explain, all iptables is doing is adding 2 rules to the prerouting chain and nat table.  One rule that redirects TCP requests on port 80 to 8080 seamlessly and the same with 443 to 8443.  Then we are saving the rules, adding iptables to startup and restarting to make sure it takes affect after a system restart.</p>
