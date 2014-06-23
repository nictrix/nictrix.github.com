---
layout: post
status: publish
published: true
title: Linux - PAM with LDAP
date: '2013-11-27 23:33:55 -0800'
date_gmt: '2013-11-28 07:33:55 -0800'
categories:
- Administration
tags:
- linux
- pam
- ldap
- active directory
- sshd
- winbind
- samba
- kerberos
- authentication
- nsswitch
comments: true
---
<p>I researched pam and ldap authentication setups for a long time and have found how to do it properly.  When I say properly I mean your Linux user account get's the same uid and gid for every server connected to the same Active Directory infrastructure.</p>
<p>The documents/discussions don't just come out and say it.  I tested this for a while and below is how you can setup PAM with LDAP and keep the same uid and gid on each Linux server.</p>
<p>First let's install the necessary packages:</p>

{% highlight bash %}
apt-get install winbind libpam-krb5 smbclient krb5-user ntpdate ntp nscd
{% endhighlight %}

<p>Let's setup samba smb.conf for (/etc/samba/smb.conf):</p>

{% highlight bash %}
[global]
   server string = %h server (Samba, Ubuntu)
   dns proxy = no
   log file = /var/log/samba/log.%m
   max log size = 1000
   log level = 1
   syslog only = yes
   syslog = 0
   panic action = /usr/share/samba/panic-action %d

   security = ads
   realm = myADdomain.com
   workgroup = myADdomain
   restrict anonymous = 2
   encrypt passwords = true
   obey pam restrictions = yes
   unix password sync = yes
   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .
   pam password change = yes
   map to guest = bad user

   #This is where the uid/gid matching with ldap id comes in
   idmap uid = 10000-100000000
   idmap gid = 10000-100000000
   idmap config * : backend = rid
   idmap config * : range = 10000-100000000

   template shell = /bin/bash
   template homedir = /home/%U
   client use spnego = yes
   client ntlmv2 auth = yes
   winbind enum groups = yes
   winbind enum users = yes
   winbind use default domain = yes
   winbind cache time = 10
   winbind nested groups = yes
   usershare allow guests = yes

   load printers = no
{% endhighlight %}

<p>Next setup the kerberos configuration (/etc/krb5.conf):</p>

{% highlight bash %}
[logging]
default = FILE:/var/log/krb5libs.log
kdc = FILE:/var/log/krb5kdc.log
admin_server = FILE:/var/log/kadmind.log
[libdefaults]
        default_realm = MYADDOMAIN.COM
        krb4_config = /etc/krb.conf
        krb4_realms = /etc/krb.realms
        kdc_timesync = 1
        ccache_type = 4
        forwardable = true
        proxiable = true
  dns_lookup_realm = true
  dns_lookup_kdc = true
        v4_instance_resolve = false
        v4_name_convert = {
                host = {
                        rcmd = host
                        ftp = ftp
                }
                plain = {
                        something = something-else
                }
        }
        fcc-mit-ticketflags = true
[realms]
        MYADDOMAIN.COM = {
                kdc = myADdomain.com
                admin_server = myADdomain.com
                default_domain = myADdomain.com
        }
[domain_realm]
        myADdomain.com = MYADDOMAIN.COM

[login]
        krb4_convert = true
        krb4_get_tickets = false
[appdefaults]
 pam = {
   debug = false
   ticket_lifetime = 36000
   renew_lifetime = 36000
   forwardable = true
   krb4_convert = false
 }
{% endhighlight %}

<p>Now that we've configured samba and kerberos we can now add the server to the domain (you'll need priviledges into the Computers OU:</p>

{% highlight bash %}
net rpc join -U mydomainadmin_username
ldconfig
{% endhighlight %}

<p>From there we want the Linux server to recognize kerberos and samba authentications by updating a couple files, see below:</p>
<p>/etc/nsswitch.conf</p>

{% highlight bash %}
#Change the ones you see in nsswitch to these below (keep in this order)
passwd:         compat winbind
group:          compat winbind
shadow:         compat winbind

hosts:          files dns wins
{% endhighlight %}

<p>/etc/pam.d/common-session</p>

{% highlight bash %}
#Add these to the top of the file
session required pam_mkhomedir.so umask=0022 skel=/etc/skel
session sufficient pam_winbind.so
session required pam_unix.so
{% endhighlight %}

<p>/etc/pam.d/common-account</p>

{% highlight bash %}
#Add these to the top of the file
account sufficient pam_winbind.so
account required pam_unix.so
{% endhighlight %}

<p>/etc/pam.d/common-auth</p>

{% highlight bash %}
#Add these to the top of the file
auth sufficient pam_winbind.so krb5_auth krb5_ccache_type=FILE
auth sufficient pam_unix.so nullok_secure use_first_pass
auth required pam_deny.so

#And comment out this line:
auth   [success=1 default=ignore]      pam_winbind.so krb5_auth krb5_ccache_type=FILE cached_login try_first_pass

#And add this line right below it:
auth    [success=1 default=ignore]      pam_winbind.so require_membership_of=myUnixUsersGroup krb5_auth krb5_ccache_type=FILE cached_login try_first_pass
{% endhighlight %}

<p>#Restart winbind</p>

{% highlight bash %}
service winbind restart
{% endhighlight %}

<p>That's it, you've now setup your Linux box to accept requests from Active Directory users.</p>
<p>Also did you see in the above PAM config common-auth the "myUnixUsersGroup" is the group we attached that are allowed to login to Linux servers.  Below is a listing of other files you may want to configure and/or check.</p>
<p>/etc/ssh/sshd_config</p>

{% highlight bash %}
#Make sure this is set properly in the file
UsePAM yes
{% endhighlight %}

<p>/etc/sudoers</p>

{% highlight bash %}
#Let's allow only the Linnux Admins group to sudo
%grpUnixAdmin ALL=(ALL) ALL
{% endhighlight %}
