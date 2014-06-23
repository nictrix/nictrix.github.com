---
layout: post
title: "Thank you Github pages and Cloudflare"
description: "How I migrated from DigitalOcean small server and wordpress to Jekyll, Github Pages and Cloudflare"
category:
  - Administration
tags:
  - digitalocean
  - cloudflare
  - github pages
  - jekyll
  - wordpress
  - performance
  - response times
---
<p>
  I recently migrated my blog from a DigitalOcean server running Wordpress to Jekyll running on Github Pages, behind Cloudflare.  I went from a <b>paid server</b> running a blogging software to a <b>free service</b> (github pages) with Jekyll as the static blog framework.  During the move I noticed I would need to stop using SSL and that introduced the ability to use Cloudflare for free.
</p>

<p>
  The reasons why I moved were:
  <ul>
    <li>Price
    <li>Speed of blogging
  </ul>

  What I lost not running my own server:
  <ul>
    <li>HTTPS
    <li>Google Adwords (no reason to keep them)
  </ul>

  What I gained from using Github Pages, Jekyll and Cloudflare:
  <ul>
    <li>Speed
    <li>Uptime
    <li>Backups
    <li>Price
    <li>Protection from Cloudflare
  </ul>

  Losing SSL is tough for me as I am a supporter of SSL for everything, but the pros of moving slightly edged out the reasons to keep SSL.  Though SSL is available via the non-custom domain name of this blog. (nictrix.github.io)
</p>

<p>
  Getting better uptime and speed was a nice thing to have when switching, however it wasn't a prerequisite.  An awesome reason to switch was free backups (I shouldn't say that, but I'm putting some trust in github pages)
  <br>
  <br>

  I use a free pingdom account to monitor my blog and after moving it I checked the account and to my surprise I had a <b>633% decrease in response time</b>,  it went from 950 ms to 150 ms.
  <br>

  {% thumbnail public/blog.nictrix.net_Response_Time_Reports.png 50x50< %}
</p>

<p>
  That speed decrease is very impressive!  Using Github's infrastructure for speed and Cloudflare's services to provide protection and speed I greatly increased my availability and decreased response time.  Thank you for such wonderfully free services!
</p>
