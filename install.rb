#!/usr/bin/env ruby
home = File.expand_path(ENV['HOME'])

Dir['dot*/**/*'].each do |file|
  dot = file =~ /dotted/ ? "." : ""

  target = File.join(home, "#{dot}#{file.sub(/^dot\w*\//, "")}")

  if File.file? file
    #puts "INSTALLING #{File.expand_path file} to #{target}"
    `ln -s -f -v #{File.expand_path file} #{target}`
  else
    #puts "CREATING   #{target}"
    `mkdir -p #{target}`
  end
end
