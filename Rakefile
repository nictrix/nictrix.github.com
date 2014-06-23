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

desc "Create image thumbnails"
task :thumbnails do
  require 'mini_magick'

  def render(source,dimensions)
    source_path = "#{source}"

    raise "#{source_path} is not readable" unless File.readable?(source_path)
    ext = File.extname(source)
    desc = dimensions.gsub(/[^\da-z]+/i, '')
    dest = "#{File.dirname(source)}/#{File.basename(source, ext)}-#{desc}#{ext}"
    dest_path = File.dirname(__FILE__) + "/#{dest}"

    if !File.exists?(dest_path) || File.mtime(dest_path) <= File.mtime(source_path)
      puts "Thumbnailing #{File.basename(source)} to #{dest}"

      image = MiniMagick::Image.open(source_path)
      image.strip
      image.resize dimensions
      image.write dest_path
    end
  end

  Dir.glob('_posts/*.markdown') do |file|
    f = File.read(file)

    next if f !~ /img src=/i

    f.each_line do |line|
      next if line !~ /img src=/i

      clean_line = line.gsub(/.*='/,'').gsub(/'>/,'')
      source = "#{clean_line.split('-').first}.#{clean_line.split('-').last.gsub(/.*\./,'')}".strip
      dimensions = clean_line.split('-').last.gsub(/\..*/,'').strip

      render(source,dimensions)
    end
  end
end
