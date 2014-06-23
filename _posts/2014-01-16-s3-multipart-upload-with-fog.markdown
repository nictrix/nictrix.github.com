---
layout: post
status: publish
published: true
title: S3 - Multipart upload with fog
date: '2014-01-16 23:51:06 -0800'
date_gmt: '2014-01-17 07:51:06 -0800'
categories:
- Development
tags:
- s3
- ruby
- fog
- amazon
- linux
- multipart upload
- ETag
- md5sum
- threads
comments: true
---
<p>I needed to understand multipart uploads with fog and how to keep the ETag MD5sum the same with multipart or single stream uploads to S3.  In the end it was very embarrassing for Amazon to not have the ETag working the same for both.  I understand the fact that both had a different route on getting to S3, but in the end 1 file is created meaning 1 ETag algorithm should be used.</p>
<p>The basics is to do the multipart upload, then overwrite the file with itself, S3 will then give you the proper md5sum under the ETag value.  Below is the code to do the upload then copy the file to itself with a normalized ETag.</p>

{% highlight ruby %}
require 'fog'
require 'digest/md5'
require 'filemagic'
connection = Fog::Storage.new({ :provider => "AWS", :aws_access_key_id => access_key, :aws_secret_access_key => secret_key })

file = File.absolute_path(file)
file_name = "myfiles/#{File.basename(file)}"
file_md5sum = Digest::MD5.file(file).to_s

multipart_uploads = connection.list_multipart_uploads("myS3bucket")

multipart_uploads.data[:body]["Upload"].each do |part|
  if part["Key"] == file_name
    abort_result = connection.abort_multipart_upload(myS3bucket, file_name, part["UploadId"])
  end
end

content_type = FileMagic.new(FileMagic::MAGIC_MIME).file(file).split(';').first

file_temporary_directory = Dir.mktmpdir
file_split_result = system("/usr/bin/split -C 10M -a 4 -d #{file} #{file_temporary_directory}/")

file_md5_parts = {}

file_parts = Dir.glob("#{file_temporary_directory}/*").sort

file_parts.each do |file_part|
  file_md5_parts[file_part] = Digest::MD5.file(file_part).base64digest
end

s3_multipart = connection.initiate_multipart_upload(myS3bucket, file_name, { 'x-amz-acl' => access, 'Content-MD5' => file_md5sum, 'Content-Type' => content_type } )

s3_upload_id = s3_multipart.body["UploadId"]

md5_indices = []
threads = []

file_md5_parts.each_with_index do |file_md5_part, index|
  file_part_number = index + 1

  connection.reload

  threads < < Thread.new(file_md5_part) do |f|
    File.open(file_md5_part[0]) do |part|
      response = connection.upload_part(myS3bucket, file_name, s3_upload_id, file_part_number, part, { 'Content-MD5' => file_md5_part[1] } )
      md5_indices[index] = response.headers['ETag']
    end
  end
end

threads.each do |t|
  begin
    t.join
  rescue Exception => e
    puts "failed upload: #{e.message}"
    exit 1
  end
end

connection.reload

begin
  completed_upload_result = connection.complete_multipart_upload(myS3bucket, file_name, s3_upload_id, md5_indices)
rescue => error
  exit 1 if error.message =~ /400 Bad Request/
end

if completed_upload_result.status == 200
  copy_result = connection.copy_object(myS3bucket, file_name, myS3bucket, file_name, { 'x-amz-metadata-directive' => 'REPLACE' })

  if copy_result.status == 200
    exit 1 if copy_result.data[:body]["ETag"] != file_md5sum
  end
end
{% endhighlight %}

<p>I have used examples of code from multiple locations on the web, mostly searching for 'multipart uploads fog'</p>
<p><a href="http://blog.vicecity.co.uk/posts/168491-multipart-uploads-fog-threads-win">http://blog.vicecity.co.uk/posts/168491-multipart-uploads-fog-threads-win</a><br />
<a href="http://baldowl.github.io/2011/02/18/multipart-uploads-with-fog.html">http://baldowl.github.io/2011/02/18/multipart-uploads-with-fog.html</a></p>
