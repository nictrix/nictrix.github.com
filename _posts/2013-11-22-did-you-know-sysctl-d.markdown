---
layout: post
title: Did you know? Sysctl.d
description: "Sysctl and it's undocumented initializing of sysctl.d/"
categories:
- Administration
tags:
- sysctl
- limits
- ulimit
- rhel
- centos
- fedora
- amazon linux
---
<p>Maybe I'll start making small posts like this, where I did a quick write up about a particular technology...we'll see how it works out...</p>
<p>Did you know that by default in RHEL, CentOS, Fedora, Amazon Linux that sysctl automatically evaluates files in /etc/sysctl.d - I found this out only after reading the <a href="https://bugzilla.redhat.com/show_bug.cgi?id=593211">bug report</a>.</p>
<p>Apparently this code is in /etc/rc.sysinit, which will evaluate sysctl.d files.  Though I have never seen /etc/sysctl.d directory from a default install.  So if you have an application that needs changes made via sysctl then add that directory and have the application's configuration in there.  Like so:</p>

{% highlight bash %}
ls -la /etc/sysctl.d

elasticsearch
logstash
tomcat
{% endhighlight %}
