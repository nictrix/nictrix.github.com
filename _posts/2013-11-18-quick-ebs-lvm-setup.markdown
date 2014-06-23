---
layout: post
title: Quick EBS LVM Setup
description: "LVM and EBS"
categories:
  - Administration
tags:
- aws
- ebs
- lvm
- bash
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
