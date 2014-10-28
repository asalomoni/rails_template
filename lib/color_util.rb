module ColorUtil
  def self.minimum_bright(baseColor, value)
    bright = bright(baseColor)

    if bright < value
      r,g,b = rgb(baseColor)
      k = value - bright
      color(trim(r+k),trim(g+k),trim(b+k))
    else
      baseColor
    end
  end

  def self.bright(color)
    r,g,b = rgb(color)
    (r+g+b) / 3.0
  end

  def self.trim(value)
    [0, [255,value].min].max
  end

  def self.rgb(color)
    color.gsub('#','').scan(/../).map { |c| c.hex.to_i }
  end

  def self.color(r,g,b)
    "#%02x%02x%02x" % [r,g,b]
  end
end