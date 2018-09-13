def render(path, &block)
  content_file = ContentFile.new(path)

  if content_file.fullpath.end_with?(".haml")
    if block_given?
      Haml::Engine.new(content_file.contents).render(&block)
    else
      Haml::Engine.new(content_file.contents).render
    end
  elsif content_file.fullpath.end_with?(".md")
    PandocRuby.new(content_file.contents).to_html
  else
    raise "Renderer not found for #{content_file.fullpath}."
  end
end

class ContentFile
  EXTS = [".md", ".haml"]

  attr_reader :path, :ext, :stem, :dir, :basename

  def initialize(path)
    @path = path
    @ext = File.extname(path)
    @stem = File.basename(path, ext)
    @dir = File.dirname(path)
    @basename = File.basename(path)

    raise "#{path} does not exist" unless exists?
  end

  def contents
    @contents ||= EmojiParser.detokenize(File.read(fullpath))
  end

  def fullpath
    @fullpath ||= candidates.detect { |path| File.exists?(path) }
  end

  def to_s
    basename
  end

  def exists?
    fullpath != nil
  end

  def partial?
    stem.start_with?("_")
  end

  # If the template opens with a doctype declaration, assume we're a full
  # page.
  def fullpage?
    File.open(path, &:readline)[0..2] == "!!!"
  end

  private

  def candidates
    [
      path,
      File.join(dir, "_" + basename),
      File.join(dir, "content", basename),
      File.join(dir, "content", "_" + basename),
      EXTS.map { |ext| path + ext },
      EXTS.map { |ext| File.join(dir, "_" + stem + ext) },
      EXTS.map { |ext| File.join("content", path + ext) },
      EXTS.map { |ext| File.join(dir, "content", "_" + stem + ext) }
    ].flatten
  end
end
