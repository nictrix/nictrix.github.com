---
layout: post
title: Ubuntu Server Create New Linux Interface
description: "How to add a Linux interface to Ubuntu"
categories:
- Administration
tags:
- ubuntu
- debian
- ip address
- ifconfig
- network
- lshw
- interface
---
<p>If you just added a new interface to your Ubuntu server, you'll want to find this interface and give it an IP address.  Below are the steps to find it and add a static IP:</p>

{% highlight bash %}
sudo lshw -C network #will tell you eth1 or similiar
sudo vi /etc/network/interfaces

auto eth1
iface eth1 inet static
  address 10.0.56.212
  netmask 255.255.255.0
  network 10.0.56.0
  broadcast 10.0.56.255
{% endhighlight %}

<p>Save the /etc/network/interfaces file and now see if you get a connection with the below command:</p>

{% highlight bash %}
sudo ifup eth1 && ifconfig
{% endhighlight %}

<p>Now you should be able to ping the gateway:</p>

{% highlight bash %}
ping 10.0.56.1
{% endhighlight %}

