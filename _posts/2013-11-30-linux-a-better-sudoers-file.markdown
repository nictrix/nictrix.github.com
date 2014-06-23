---
layout: post
status: publish
published: true
title: Linux - A better sudoers file
date: '2013-11-30 21:42:36 -0800'
date_gmt: '2013-12-01 05:42:36 -0800'
categories:
- Administration
tags:
- linux
- sudoers
- sudo
- permissions
- authorization
- restricted
- shell
- root
- administration
- systems
comments: true
---
<p>In the massive amount of Linux systems I've seen over the years not a single one of them had a great sudoers file.  Some were doing command line restrictions for one or two accounts, others were doing nothing more than allowing people to sudo straight to root and some had LDAP integration that gave certain groups permissions.  But with each one of these the groups/users that had sudo was a very generic group of administrators that may or may not know Linux very well.  That was the choice of the managers and directors, which I understand is a very low level item to put time into.  However, their time would be well worth the effort of securing authorization from a security, compliance and keep your job type of situation.</p>
<p>I've known how to use sudo and sudoers file for a long time, but I decided to do a ton of research on sudo and how the sudoers file really works specifically the commands assigned to users and how to restrict users to those commands.  Then I also did research on how to become root without the privileges, from vim breakouts to creating substitute files that give you root.  With this I was able to create a sudoers file that I believe is very secure, but flexible enough to give the necessary access to users of the system.</p>
<p>These types of systems were usually multiple users accessing root privileges, not a VPS or single user access.  And it would be multiple team roles like; developers, administrators, release engineers and database administrators.</p>
<p>Below is a simple example of a sudoers file, without any extra privileges, but with restricted shells and a couple other things.</p>

{% highlight bash %}
Cmnd_Alias SHELLS_RESTRICTED=/bin/sh,/sbin/sh,/sbin/jsh,/usr/bin/sh,/bin/csh,/usr/bin/csh,/bin/ksh, \
  /usr/local/share/bin/tcsh,/usr/local/share/bin/bash,/usr/local/bin/tcsh,/usr/local/bin/bash,/usr/bin/rsh, \
  /usr/local/bin/zsh,/usr/bin/ksh
Cmnd_Alias EDITORS_RESTRICTED=/bin/more,/bin/less,/usr/bin/less,/usr/bin/vim,/usr/bin/vi,/bin/vi
Cmnd_Alias PROGRAMMING_RESTRICTED=/usr/bin/perl,/usr/bin/python,/usr/bin/ruby,/usr/bin/irb

Defaults requiretty
Defaults always_set_home
Defaults env_reset
Defaults env_keep =  "COLORS DISPLAY HOSTNAME HISTSIZE INPUTRC KDEDIR LS_COLORS"
Defaults env_keep += "MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE"
Defaults env_keep += "LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES"
Defaults env_keep += "LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE"
Defaults env_keep += "LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY"
Defaults secure_path = /sbin:/bin:/usr/sbin:/usr/bin
Defaults!SHELLS_RESTRICTED noexec
Defaults!EDITORS_RESTRICTED noexec
Defaults!PROGRAMMING_RESTRICTED noexec
Defaults loglinelen = 0, logfile =/var/log/sudo.log, log_year, log_host, syslog=auth

root ALL = (ALL) ALL
{% endhighlight %}

<p>To explain the above sudoers file...</p>
<ul>
<li>You'll see a couple Cmnd_Alias directives, these list out files that could be compromised to allow a person to become root if they were run with the sudo command.</li>
<li>Then we add environmental variables that we allow in when someone does a sudo.</li>
<li>I kept requiretty because I don't want any other session, but a shell login session to be allowed to sudo.  So if someone creates a cronjob that runs sudo or cgi-bin script that runs sudo they will be blocked.  I've also added a sudo log, to see what is running sudo commands.</li>
<li>I've added a secure_path variable to make sure this is the path used during sudo commands.</li>
</ul>
<p>It's not a matter of trust, it's a matter of doing things correctly and the same.  Too many times I've seen it where people expect to have full sudo rights because they don't know how to do something without sudo. Ask a systems administrator to do things with sudo in front of it without being root, it's a very different shell world when they start to do that. (or at least try)</p>
<p>And when they start to put sudo in front of their commands they begin to respect the abilities of sudo, root and authorization to the Linux system.  And they can also design systems or commands a bit differently, which is a good thing in my opinion.</p>
<p> **NOTE** it does matter where you put things in a sudoers file so beware of that.</p>
<p>Okay now that we'e gotten a basic sudoers file out of the way, let's create a sudoers file that makes it so a systems administrator can run sudo as themselves and we can capture those commands for audits and such.</p>

{% highlight bash %}
Cmnd_Alias HALT=/usr/sbin/halt,/usr/sbin/fasthalt,/sbin/shutdown -h,/sbin/shutdown -H, \
  /sbin/shutdown -P,/sbin/reboot -p
Cmnd_Alias REBOOT=/sbin/shutdown -r,/sbin/reboot -f
Cmnd_Alias SERVICE=/sbin/chkconfig,/sbin/service
Cmnd_Alias FILE=/bin/chmod,/bin/chown,/bin/ln,/bin/mkdir,/usr/bin/chattr,/usr/bin/lsattr, \
  /bin/touch,/bin/rm,/bin/rmdir,/bin/cat,/bin/ls,/usr/bin/diff,/usr/bin/locate,/sbin/mkfs,/sbin/fsck, \
  /sbin/lvm,/sbin/lvmconf,/sbin/lvmdump,/bin/mount,/bin/umount,/usr/bin/hexdump,/usr/bin/head, \
  /usr/bin/tail,/bin/grep,/bin/echo,/usr/bin/md5sum,/usr/bin/test
Cmnd_Alias PROCESS=/bin/kill,/usr/bin/killall,/bin/ps
Cmnd_Alias STATISTICS=/usr/sbin/tcpdump,/usr/sbin/lnstat,/usr/bin/iostat,/usr/bin/free, \
  /usr/bin/sar,/bin/netstat,/usr/bin/vmstat,/usr/bin/du
Cmnd_Alias NETWORK=/usr/bin/nslookup,/bin/traceroute
Cmnd_Alias SYSTEM=/usr/bin/strace,/bin/env,/usr/bin/nohup,/usr/sbin/lsof
Cmnd_Alias PACKAGE_MANAGEMENT=/usr/bin/yum,/bin/rpm,/usr/bin/gem
Cmnd_Alias SUDO_EDIT=sudoedit /etc/fstab #add more on here as necessary

Cmnd_Alias SYSTEM_ADMINISTRATORS=SERVICE,FILE,PROCESS,STATISTICS,NETWORK, \
  SYSTEM,PACKAGE_MANAGEMENT,SUDO_EDIT,HALT,REBOOT

%system_administrators ALL = (ALL) NOPASSWD: SYSTEM_ADMINISTRATORS
{% endhighlight %}

<p>Now the group system_administrators have access to what they need access to.  They cannot become root, but they can do their specific tasks they need on the system.  Granted the sudoers file tells the systems administrators what they can do, but isn't that what setting up and knowing what a system does is all about anyways?  I never liked the argument of we want no restrictions because we are the systems administrators.  What I say to that is if you do not fully understand your application then you haven't integrated with the developers or database teams well enough to do a throughout job of restricting only what is needed.  You haven't done your systems administrator's job.</p>
<p>And what is the benefit of doing these restrictions? Security, compliance, full working knowledge of what the application does and needs and proper authorization without blocking anyone from doing what they need to do.  Now this makes it so your application's base OS configuration is customized to allow people to do what they need for the application.  So I do acknowledge that it requires extra work, but we do the same thing when we do nice, ulimit or other types of restrictions.</p>
<p>Oh! and a couple other thing to say is...</p>
<p>These sudoers examples are not for every type of system, just ones you have fully baked in a particular environment.  If you fully understand the application and want to secure it in production, then use sudoers to lock it down and restrict it to what is needed.  </p>
<p>Make sure your delete your root user's password after you have figured out your sudo situation, you don't need people trying to brute force the root user.  And delete any other user's passwords, stop using passwords and start using sudo and ssh public keys.</p>
<p>Please don't ssh in as root or login as the root user.</p>
<p>And remember many systems these days are throw away because they are virtual machines that can be duplicated.</p>
<p>---<br />
I plan to write more about sudo.  Just need to get some thoughts put together and I'll have something out soon.</p>
