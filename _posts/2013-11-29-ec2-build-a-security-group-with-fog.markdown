---
layout: post
title: EC2 - Build a security group with fog
description: "How to build a security group in Amazon with fog gem"
categories:
- Development
- Administration
tags:
- fog
- amazon
- ec2
- firewall
- acls
- security group
- cidr
- ports
- protocols
---
<p>There are not many examples for the ruby gem fog, what I use is the rdoc pages for the information about the fog API.  Usually that works for me, but sometimes there is trial and error, which takes time.  I've been making these short posts about different things you can do with fog so that it helps someone else down the line.</p>

<p>For this post you'll learn how to make a EC2 security group and then authorize Amazon ELBs and an IP address range.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::Compute.new(:provider => 'AWS', :aws_access_key_id => access_key, :aws_secret_access_key => secret_key, :region => "us-east-1")
sg = connection.security_groups.new(:name => "myservers_security_group", :description => "For my web servers running Linux")
sg.save

#Let's do a get, just to make sure it's there
sg = connection.security_groups.get("myservers_security_group")

#Now let's authorize a CIDR
result = sg.authorize_port_range(22..22, {:cidr_ip => "192.168.1.100/32"})

if result.status != 200
  puts "Failed to authorize cidr"
end

#Now let's authorize another EC2 security group
result = sg.authorize_port_range(80..80, {:group => { 'amazon-elb' => 'amazon-elb-sg'}, :ip_protocol => 'tcp'})

if result .status != 200
  puts "Failed to authorized group"
end
{% endhighlight %}

<p>If you look at the authorize EC2 group you'll see "amazon-elb", which is the accountID and "amazon-elb-sg" is the security group name.  So for your account, you would put the actual accountID (which should be a bunch of numbers)</p>
