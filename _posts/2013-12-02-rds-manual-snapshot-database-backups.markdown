---
layout: post
status: publish
published: true
title: RDS - Manual Snapshot database backups
date: '2013-12-02 21:27:17 -0800'
date_gmt: '2013-12-03 05:27:17 -0800'
categories:
- Administration
tags:
- ruby
- fog
- amazon
- rds
- linux
- snapshots
- database
- db
- backups
comments: true
---
<p>I've already posted how to use the ruby gem fog to create an RDS instance, now I will post how to create a manual snapshot of an RDS instance, in case once per day is not good enough.  Below you'll find the code to do just that.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::AWS::RDS.new(:aws_access_key_id => access_key, :aws_secret_access_key => secret_key, :region => "us-east-1")
result = connection.create_db_snapshot("my_database_instance", "my_database_instance-manual-1")

if result.status != 200
  puts "RDS manual snapshot request failed"
end

#Now check the snapshot's progress
mydb = rds.servers.get("my_database_instance")

my_snapshot = mydb.snapshots.get("my_database_instance-manual-1")

while my_snapshot.reload.state != "available"
  print "."
  sleep 20
end

puts "Created snapshot successfully"
{% endhighlight %}

<p>Just a couple notes, manual snapshots need to be cleaned up "manually" and you'll want to validate this backup (as always).</p>
