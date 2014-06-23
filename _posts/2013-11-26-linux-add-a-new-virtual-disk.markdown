---
layout: post
title: Linux - Add a new virtual disk
description: "Adding a disk from VMware and possibly other systems"
categories:
- Administration
tags:
- lvm
- ubuntu
- linux
- scsi
- vmware
- mount
- disk
- extend
---
<p>I've used this code below to add a new virtual disk to a VMWare virtual server running Ubuntu.</p>

{% highlight bash %}
#scan the bus
rescan-scsi-bus
fdisk -l #check it

#now let's add it to an logical volume:
pvcreate /dev/sdb
vgextend mycurrentLVM /dev/sdb
lvextend -L +100G /dev/mycurrentLVM/data

#Now resize the logical disk to what we specified above ^
resize2fs /dev/mycurrentLVM/data
{% endhighlight %}

<p>Pretty simple stuff, I wanted to do a quick write up in case I need it in the future.</p>
<p>And I might as well write up how to get to adding new virtual disks to a current logical volume. Below is the code to create that logical volume on Ubuntu.</p>

{% highlight bash %}
#scan the bus
rescan-scsi-bus
fdisk -l #check it

#Let's create a new logical volume
pvcreate /dev/sdc
vgcreate mycurrentlvm /dev/sdc
lvcreate -l 50%VG -n data mycurrentlvm
mkfs.ext4 /dev/mycurrentlvm/data

#Let's get the new file system mounted
mount /dev/mapper/mycurrentlvm-data /data

#Let's make sure it mounts on startup
echo /dev/mapper/mycurrentlvm-data /data      ext4    errors=remount-ro 0 0 >> /etc/fstab
{% endhighlight %}

