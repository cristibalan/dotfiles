#!/usr/bin/env ruby -w
command = ARGV.shift
files = {}

ARGV.each do |arg|
  Dir[arg].each { |file|
    files[file] = File.mtime(file)
  }
end

puts "=> first run"
puts "=> #{command}"
system(command)
puts "=> done"

# puts "Watching #{files.keys.join(', ')}\n\nFiles: #{files.keys.length}"
puts "Watching #{files.keys.length} files"

trap('INT') do
  puts "\nQuitting..."
  exit
end

loop do
  sleep 1

  changed_file, last_changed = files.find { |file, last_changed|
    File.mtime(file) > last_changed
  }

  if changed_file
    files[changed_file] = File.mtime(changed_file)
    puts "=> #{changed_file} changed"
    puts "=> #{command}"
    system(command)
    puts "=> done"
  end
end
