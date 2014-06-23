require 'rake'
require 'time'

desc "Begin a new post #rake post title='A Title')"
task :post do
  abort("rake aborted: _posts directory not found.") unless FileTest.directory?('_posts')
  abort("Missing title environment variable") if ENV['title'].nil?
  title = ENV["title"]

  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  date = Time.now.strftime('%Y-%m-%d')

  filename = File.join('_posts', "#{date}-#{slug}.markdown")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts 'description: ""'
    post.puts "category: []"
    post.puts "tags: []"
    post.puts "---"
  end
end