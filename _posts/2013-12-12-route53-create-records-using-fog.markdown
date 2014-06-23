---
layout: post
status: publish
published: true
title: Route53 - Create records using fog
date: '2013-12-12 23:43:34 -0800'
date_gmt: '2013-12-13 07:43:34 -0800'
categories:
- Administration
tags:
- ruby
- fog
- amazon
- ec2
- route53
- dns
- zone
- a record
- ipv4
comments: true
---
<p>As you can tell from my posts I use fog a lot and it works well in most situations.  Here's another one, I want to load up a hosted zone and create a record for my EC2 machine:</p>

{% highlight ruby %}
require 'fog'
connection = Fog::DNS.new({ :provider => "aws", :aws_access_key_id => access_key, :aws_secret_access_key => secret_key})

zone = connection.zones.get("Z111111QQQQQQQ")

#Create a record:
record = zone.records.create({ :name => "mynewhost.local", :value => ["127.0.0.1"], :type => "A", :ttl => 300 })

while record.reload.status != "INSYNC"
  sleep 2
end

#Find that record:
record = zone.records.get("mynewhost.local")
puts record.reload
{% endhighlight %}

<p>You'll need to get the hosted zoneID from Amazon (i.e. Z111111QQQQQQQ)</p>
