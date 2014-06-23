---
layout: post
status: publish
published: true
title: Chef Re-convergence within a cookbook
date: '2013-11-24 00:00:10 -0800'
date_gmt: '2013-11-24 08:00:10 -0800'
categories:
- Administration
tags:
- linux
- chef
- hack
- convergence
- ohai
- application deployment
- opscode
- reconvergence
comments: true
---
<p>I've been using Chef for many years now and just figured out through some searching and troubleshooting how to reconverge a node during a Chef run.  What I mean by this, is to allow the Chef run to converge like usual, then ask it later on in the recipe to converge again before finishing out the rest of the cookbook.</p>
<p>The one example I used for this method is I needed to download a remote file and that remote file had my application's version in it.  I couldn't assign it to attributes or to a ruby variable.  Both would have been converged before I downloaded the file.  So I needed a way to reconverge, download the file, set the attribute and continue on.  Below is the code to do just that:</p>

{% highlight ruby %}
#Initialize a new chef client object
client = Chef::Client.new
client.run_ohai #you probably only need this if you need to get new data
client.load_node
client.build_node

#Intialize a new run context to evaluate later
run_context = if client.events.nil?
  Chef::RunContext.new(client.node, {})
else
  Chef::RunContext.new(client.node, {}, client.events)
end

#Initialize a chef resource that downloads the remote file
r = Chef::Resource::RemoteFile.new("myapplicationsversion.json", run_context)
r.source "https://example.com/cdn/myapplicationsversion.json"
r.run_action(:create)

#Converge and run the new resources
runner = Chef::Runner.new(run_context)
runner.converge

#Anything below this line will wait on a successfully run convergence above.  Once complete you can use the new attribute of the json file.
version = ::JSON.parse(::File.read("myapplicationsversion.json"))

node[:myapplication][:version] = version
{% endhighlight %}

<p>This is a very simple example and hack of a Chef run, but it may be helpful in other situations.  You may need this when adding a new interface, storage mount or something Chef does, but doesn't capture that data in the attributes of ohai or custom ones.</p>
<p>However, I should say if you are doing this hack, you may want to look over your design and think about how it could be done a better way.  Right after completing this code, I realized I could do this a better way and threw this code out.  Now you may be in a bind and have requirements to do these things a certain way, so hopefully this helps someone.</p>
