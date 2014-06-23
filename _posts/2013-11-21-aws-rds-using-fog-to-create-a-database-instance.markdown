---
layout: post
status: publish
published: true
title: AWS RDS - Using Fog to create a database instance
date: '2013-11-21 21:59:46 -0800'
date_gmt: '2013-11-22 05:59:46 -0800'
categories:
- Development
- Administration
tags:
- aws
- ruby
- fog
- amazon
- rds
- mysql
comments: true
---
<p>Wanted to do a quick write up on how to create a mySQL RDS instance at Amazon with the ruby gem fog.</p>

{% highlight ruby %}
require 'fog'
connection = Fog::AWS::RDS.new(:aws_access_key_id => access_key, :aws_secret_access_key => secret_key, :region => "us-east-1")

#Create a security group
result = connection.security_groups.create("DBSecurityGroupName" => "mynewdatabase-sg", "DBSecurityGroupDescription" => "For my new database")

security_group = connection.security_groups.get("mynewdatabase-sg")

#Add some trusted IP Addresses
security_group.authorize_cidrip("162.243.110.173/32")

#Add a trusted EC2 security group
security_group.authorize_ec2_security_group("mywebservers-sg")

#Build the database
database_options = {}
database_options.store("AllocatedStorage",5) #GBs
database_options.store("AutoMinorVersionUpgrade",true)
database_options.store("MultiAZ",true) #suggested for redundancy/high availability
database_options.store("BackupRetentionPeriod",7) #days
database_options.store("DBInstanceClass","db.m1.small")
database_options.store("DBName","mydb")
database_options.store("DBParameterGroupName","default.mysql5.6")
database_options.store("DBSecurityGroups",[ "mynewdatabase-sg" ])
database_options.store("Engine","mysql")
database_options.store("EngineVersion","5.6.13")
database_options.store("MasterUsername","mydbuser")
database_options.store("MasterUserPassword","mydbpassword")
database_options.store("Port",3306)
database_options.store("PreferredBackupWindow","01:00-01:30") #Run this just before the Maintenance Window
database_options.store("PreferredMaintenanceWindow","tue:02:00-tue:02:30")

result = connection.create_db_instance("mynewdatabase", database_options)

if result.status != 200
  puts "Unable to create the RDS instance"
end

#Get the database object
rds_instance = rds.servers.get("mynewdatabase")

#Let's wait until it's ready
while rds_instance.reload.state != "available"
  print "."
  sleep 30
end

#Let's add the workload type tag "production"
rds_instance.add_tags({"workload-type"=>"production"})
{% endhighlight %}

<p>Now you should have a new mysql database in Amazon RDS.</p>
