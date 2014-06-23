require 'mini_magick'

class Jekyll::Thumbnail < Liquid::Tag
  def initialize(tag_name, markup, tokens)
    if /(?<source>[^\s]+)\s+(?<dimensions>[^\s]+)/i =~ markup
      @source = source
      @dimensions = dimensions
    end
    super
  end

  def render(context)
    if @source
      source = @source
      dimensions = @dimensions

      source_path = File.dirname(__FILE__) + "/../#{source}"

      raise "#{source} is not readable" unless File.readable?(source_path)
      ext = File.extname(source)
      desc = dimensions.gsub(/[^\da-z]+/i, '')
      dest = "#{File.dirname(source)}/#{File.basename(source, ext)}_#{desc}#{ext}"
      dest_path = File.dirname(__FILE__) + "/../#{dest}"

      if !File.exists?(dest_path) || File.mtime(dest_path) <= File.mtime(source_path)
        puts "Thumbnailing #{File.basename(source)} to #{dest}"

        image = MiniMagick::Image.open(source_path)
        image.strip
        image.resize dimensions
        image.write dest_path
      end

      """<img src='#{dest}' />"""
    else
      "Could not create thumbnail for #{source}. Usage: thumbnail /path/to/local/image.png 50x50<"
    end
  end
end

Liquid::Template.register_tag('thumbnail',   Jekyll::Thumbnail)
