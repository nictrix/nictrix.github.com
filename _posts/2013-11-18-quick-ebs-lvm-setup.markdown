---
layout: post
status: publish
published: true
title: Quick EBS LVM Setup
date: '2013-11-18 00:57:25 -0800'
date_gmt: '2013-11-18 08:57:25 -0800'
categories:
  - Administration
tags:
- aws
- ebs
- lvm
- bash
comments: true
---
<p>Just a quick note on how to setup EBS in EC2 with LVM</p>

{% highlight bash %}
pvcreate /dev/xvdb
vgcreate new_mount /dev/xvdb
lvcreate -l 100%FREE -n lvm new_mount
mkdir /new_mount
mkfs.ext4 /dev/mapper/new_mount-lvm
echo "/dev/mapper/new_mount-lvm /new_mount auto noatime 0 0" | sudo tee -a /etc/fstab
mount /dev/mapper/new_mount-lvm /new_mount
{% endhighlight %}
