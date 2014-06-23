---
layout: post
title: EC2 - Amazon Linux - stop auto upgrade
description: "Autoupgrading in Amazon Linux is good for some and bad for others"
categories:
- Administration
tags:
- amazon
- ec2
- security
- yum
- updates
- ami
- repos
---
<p>Amazon Linux which runs only on EC2 instances implements an auto upgrade function when it first boots.  When you have a much older AMI like 2011.09 or 2012.03 it tries to do a yum update with a newer repository like the recently released 2013.09.  As you can tell the older the AMI the longer the update will take.  When I run Chef and other cloud-init type functions I run into a yum lock issue.  What you want to do to "fix" this problem is to add user-data when the EC2 instance starts up.  Below is the necessary cloud-init.</p>

{% highlight bash %}
#cloud-config
repo_releasever: 2013.03
repo_upgrade: none
{% endhighlight %}

<ul>
<li>#cloud-config tells us to use this data for yum config.</li>
<li>repo_releasever tells the AMI to keep yum at 2013.03 instead of the latest which is default</li>
<li>repo_upgrade tells the AMI to not do security updates on boot</li>
</ul>
