---
layout: post
status: publish
published: true
title: AWS EC2 - Create an ELB with Fog
date: '2013-11-22 21:34:21 -0800'
date_gmt: '2013-11-23 05:34:21 -0800'
categories:
- Development
- Administration
tags:
- aws
- load balancer
- ruby
- fog
- elb
- gem
- ec2
comments: true
---
<p>I like to post things that are helpful and not highly documented.  Here is an example of building out ELBs via the ruby gem fog:</p>

{% highlight ruby %}
require 'fog'
connection = Fog::AWS::ELB.new(:aws_access_key_id => access_key, :aws_secret_access_key => secret_key, :region => "us-east-1")

#Build the Load Balancer
availability_zones = ["us-east-1d", "us-east-1b", "us-east-1c"]
listeners = [ { "Protocol" => "HTTP", "LoadBalancerPort" => 80, "InstancePort" => 8080, "InstanceProtocol" => "HTTP" } ]
result = connection.create_load_balancer(availability_zones, "mynewlb", listeners)

if result.status != 200
  puts "ELB creation failed!"
end

#Let's get the new load balancer's object
elb = connection.load_balancers.get("mynewlb")

#Let's configure a faster health check
health_check_config = { "HealthyThreshold" => 2, "Interval" => 30, "Target" => "TCP:80", "Timeout" => 5, "UnhealthyThreshold" => 3 }
health_check_result = connection.configure_health_check("mynewlb", health_check_config)

if health_check_result.status != 200
  puts "Failed health check configuration request"
end
{% endhighlight %}

<p>Now you should have a new ELB in Amazon EC2 with some basic health checks and a listener on 80 pointing to 8080.</p>
