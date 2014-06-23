---
layout: post
title: Linux - Netcat uses
description: "Simple netcat uses"
categories:
- Administration
tags:
- bash
- linux
- netcat
- serve
- sharing
- transfer
- ssh
- smtp
- session view
---
<p>I always run into new ways of using netcat as a resource for just about anything, from SSH proxies to creating scripts that do more because of the API to the network layer.</p>

<p>One thing that I thought was really cool was serving up a quick file on your computer to someone else.  Most will transfer it via email, messenger or another tool; however sometimes those tools are not available or your transferring it between servers and only interacting with your sessions on both servers.</p>

<p>Well if one server can access another server on a specific port or someone can hit your desktop on port 80 from their web browser than this one liner will really help you out.</p>

{% highlight bash %}
sudo nc -v -l 80 < myfile.txt
{% endhighlight %}

<p>Now with your web browser go to port 80 of that machine and you should be able to download that file.</p>
<p>Here's another cool thing about netcat</p>

{% highlight bash %}
nc mystmphost.example.com 25 < /tmp/my_text_based_email
{% endhighlight %}

<p>This above will allow you to create a SMTP message in a file and serve it to the SMTP host via a redirect of that file to port 25.</p>
<p>And one awesome way to make netcat useful is using it as a terminal based remote session for training or something like that.</p>

{% highlight bash %}
script -qf | tee >(nc -kl 5000) >(nc -kl 5001) >(nc -kl 5002)
{% endhighlight %}

<p>That will open ports 5000 - 5002 up on your machine and allow others to connect, once they connect they will see you begin to type commands on your computer.  This could be good for teaching something new or maybe remote troubleshooting an issue.</p>
<p>And here is the ssh proxy command I use for just about everything:</p>

{% highlight bash %}
ProxyCommand ssh reachable-host nc %h %p -w 28800 2> /dev/null
{% endhighlight %}

