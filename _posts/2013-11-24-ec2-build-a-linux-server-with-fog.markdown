---
layout: post
title: EC2 - Build a Linux server with fog
description: "Using the fog gem to build a linux server on AWS EC2"
categories:
- Development
- Administration
tags:
- ruby
- fog
- amazon
- ec2
- linux
- server
- images
- tags
---
<p>I am writing up some quick details on how to build an Amazon Linux server via the ruby gem fog.  I know this is available in many places, but I've added the tagging/image ability too and I'll be iterating on knowledge down the line.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::Compute.new(:provider => 'AWS', :aws_access_key_id =>access_key, :aws_secret_access_key => secret_key, :region => 'us-east-1')

#find an image to use
image = connection.images.all("owner-alias" => "amazon", "name" => "amzn-ami-pv-2013.03.1.x86_64-s3").first

#create the server
server = connection.servers.create(:flavor_id => "m1.small", :image_id => image.id, :key_name => "mysshkey", :groups => ["mynewserversg"])

#now you'll want to tag the server
connection.tags.create(:resource_id => server.id, :key => "Name", :value => "mynewserver")

#now let's wait for the server to be ready
while server.reload.state != "running"
  print "."
  sleep 2
end

#or you can do server.ready
server.ready?

#Then you can get the DNS name to SSH into it
puts server.dns_name
{% endhighlight %}
