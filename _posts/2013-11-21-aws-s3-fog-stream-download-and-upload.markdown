---
layout: post
title: AWS S3 - Fog Stream Download and Upload
description: "How to stream your download and uploads with the fog gem and S3"
categories:
- Development
- Administration
tags:
- aws
- s3
- ruby
- fog
- amazon
- download
- upload
- stream
---
<p>I couldn't find an exact example of streaming a file download from S3 to a local file with the ruby gem fog, so I'm posting one up here.  Below is code to connect to S3, download a file and also check the MD5 matches.</p>

{% highlight ruby %}
require 'fog'
require 'digest/md5'
connection = Fog::Storage.new({ :provider => "AWS", :aws_access_key_id => access_key, :aws_secret_access_key => secret_key })
bucket = connection.directories.new(:key => "myS3bucket")

open("mydownloadedfile.txt", 'w') do |f|
  bucket.files.get("mydownloadedfile.txt") do |chunk,remaining_bytes,total_bytes|
    f.write chunk
  end
end

downloaded_file_md5 = Digest::MD5.file(mydownloadedfile.txt).to_s #This method won't take up much memory
remote_file_md5 = connection.head_object("myS3bucket", "mydownloadedfile.txt")).data[:headers]["ETag"].gsub('"','')

if remote_md5 == local_md5
  puts "MD5 matched!"
else
  puts "MD5 match failed!"
end
{% endhighlight %}

<p>Be careful about using the ETag!  If you upload a file larger than ~30-50MBs via the S3 console you won't get an MD5, you'll get an MD5 of all chunked MD5s.  See the <a href="http://docs.aws.amazon.com/AmazonS3/latest/dev/mpuoverview.html">Amazon docs</a> for more information.  And any files uploaded larger than 5GBs from the console, fog, etc.. will not have a simple MD5 either.</p>
<p><strong>And this is how you stream an upload to S3 using fog:</strong></p>

{% highlight ruby %}
require 'fog'
require 'digest/md5'
connection = Fog::Storage.new({ :provider => "AWS", :aws_access_key_id => access_key, :aws_secret_access_key => secret_key })
bucket = connection.directories.new(:key => "myS3bucket")

local_file_md5 = Digest::MD5.file("myfiletoupload.txt")
s3_file_object = bucket.files.create(:key => "myfiletoupload.txt", :body => File.open("myfiletoupload.txt"), :content_type => "text/plain", :acl => "private")

if s3_file_object.etag != local_file_md5
  puts "MD5 match failed!"
else
  puts "MD5 matched!"
end
{% endhighlight %}

<p>Much easier than download huh?  The File.open does all the chunk work for you.</p>
