---
layout: post
status: publish
published: true
title: EC2 - Backup a EBS volume
date: '2013-11-26 23:56:42 -0800'
date_gmt: '2013-11-27 07:56:42 -0800'
categories:
- Development
- Administration
tags:
- ebs
- amazon
- ec2
- snapshots
- volumes
- backup
comments: true
---
<p>This is a quick write up on how to backup an EBS volume using the ruby gem fog.  Not only will it request a snapshot, but it will tag the snapshot for historical and audit purposes.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::Compute.new(:provider => 'AWS', :aws_access_key_id => access_ke, :aws_secret_access_key => secret_key, :region => 'us-east-1')

#Makes sure you have your volume number
vol = connection.volumes.get("vol-< ...>")

#Let's begin the backup process
snapshot = connection.snapshots.new(:volume_id => vol.id, :description => "My new snapshot")
snapshot.save
snapshot.reload

#Let's tag the snapshot
connection.tags.create(:resource_id => snapshot.id, :key => "Name", :value => "My new snapshot - 1")
connection.tags.create(:resource_id => snapshot.id, :key => "Volume", :value => vol.id)
connection.tags.create(:resource_id => snapshot.id, :key => "Current Mount Point", :value => vol.device)
connection.tags.create(:resource_id => snapshot.id, :key => "Volume - Delete on Termination?", :value => snapshot.delete_on_termination)
connection.tags.create(:resource_id => snapshot.id, :key => "AZ", :value => vol.availability_zone)

while snapshot.reload.progress != "100%"
  print "."
  sleep 10
end

#Volume snapshot is now complete.
{% endhighlight %}
