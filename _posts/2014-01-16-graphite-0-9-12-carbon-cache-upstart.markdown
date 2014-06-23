---
layout: post
title: Graphite 0.9.12 - Carbon Cache Upstart
description: "A working method of using upstart with graphite carbon agent"
categories:
- Administration
tags:
- bash
- linux
- metrics
- graphite
- carbon-cache
- upstart
- daemons
- process management
---
<p>While implementing graphite I found many examples of upstart scripts for the carbon cache agents. However, each of those examples failed to work on a system using upstart version 0.6.5.  Most of them would start carbon up, then lose the pid and in turn lose the ability to stop and restart the process. I wanted upstart to start, restart and stop carbon cache agent processes, so I ended using the --debug option. (maybe that's a hack, but it does work)</p>
<p>Below is a working upstart script for starting, restarting and stopping carbon cache.</p>

{% highlight bash %}
description "Graphite Carbon Cache"

start on runlevel [2345]
stop on runlevel [!2345]

env CARBON_CACHE=/opt/graphite/bin/carbon-cache.py
env PIDFILE=/opt/graphite/storage/logs/carbon-cache.pid

respawn
kill timeout 5

post-stop exec $CARBON_CACHE --pidfile=$PIDFILE --debug stop

script
  ulimit -n 65000
  exec $CARBON_CACHE --pidfile=$PIDFILE --debug start >> /opt/graphite/storage/log/carbon-cache/console.log 2>&1
end script
{% endhighlight %}
