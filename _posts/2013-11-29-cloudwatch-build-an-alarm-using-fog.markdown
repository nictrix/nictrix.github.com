---
layout: post
title: Cloudwatch - Build an alarm using fog
description: "How to build a cloudwatch alarm with the fog gem"
categories:
- Development
- Administration
tags:
- fog
- amazon
- cloudwatch
- alarms
- metrics
---
<p>Building a cloudwatch alarm using the ruby gem fog took me a while to figure out.  It wasn't as clear cut as other fog methods.  Below you'll see how to create the metric and then build the alarm for that metric.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::AWS::CloudWatch.new(:aws_access_key_id => access_key, :aws_secret_access_key => secret_key, :region => "us-east-1")
result = connection.put_metric_data("AWS/EC2", ["MetricName"=>"my_custom_metric", "Value"=>1.0, "Unit"=>"Count"])

if result.status != 200
  puts "Failed creating metric"
end

#You'll need to wait a very long time if this is a new metric
waiting = nil

while waiting.nil?
  sleep 10
  connection.metrics #this reload's the metrics available from the API
  waiting = connection.metrics.get("AWS/EC2","my_custom_metric")
end

#Now let's create the alarm
alarm_config = {}
alarm_config.store("AlarmName","custom_metric_alarm")
alarm_config.store("AlarmActions",[])
alarm_config.store("MetricName","my_custom_metric")
alarm_config.store("Namespace","AWS/EC2")
alarm_config.store("AlarmDescription","Notifies me when custom metric is too high")
alarm_config.store("Statistic","Average")
alarm_config.store("Unit",nil)
alarm_config.store("ComparisonOperator","GreaterThanOrEqualToThreshold") #check Amazon docs for others
alarm_config.store("Period",300) #seconds
alarm_config.store("EvaluationPeriods",1)
alarm_config.store("Threshold",10.0)
alarm_config.store("Dimensions",[])
result = connection.put_metric_alarm(alarm_config)

if result.status != 200
  puts "Alarm creation failed"
end

#You can get the alarm like this
my_alarm = cs.alarms.get("custom_metric_alarm")
{% endhighlight %}

<p>You'll notice "AWS/EC2" in many of the above methods, this is the namespace Amazon needs to have to place it in the proper location.  There are many namespaces and you can also create custom namespaces.  Like "ApplicationName:server_stats"</p>
<p>Also, I didn't put an example above, but when creating an Alarm you can specify an Action for it to take.  "AlarmActions" is an array of strings that point to an ARN for an autoscaling group policy or email.</p>
