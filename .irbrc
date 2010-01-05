IRB.conf[:PROMPT_MODE] = :SIMPLE

require "rubygems"
require "wirble"
Wirble.init
# Wirble.colorize

class Object
  # Return only the methods not present on basic objects
  def interesting_methods
    (self.methods - Object.new.methods).sort
  end
end

def copy(str)
  IO.popen('pbcopy', 'w') { |f| f << str.to_s }
end

def paste
  `pbpaste`
end

def ep
  eval(paste)
end
