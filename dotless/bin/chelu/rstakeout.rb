#!/usr/bin/env ruby -w

##
# By Mike Clark
#
# From http://www.pragmaticautomation.com/cgi-bin/pragauto.cgi/Monitor/StakingOutFileChanges.rdoc
#
# Watches files and runs a command when any of them are modified.
#
# Can use Ruby's Dir[] to get file glob. Quote your args to take advantage of this.
#
#  rstakeout 'rake test:recent' **/*.rb
#  => Unquoted uses the shell...only watches Ruby files one directory down
#
#  rstakeout 'rake test:recent' '**/*.rb'
#  => Quoted uses Ruby...watches all Ruby files in all directories and subdirectories

command = ARGV.shift
files = {}

ARGV.each do |arg|
  Dir[arg].each { |file|
    files[file] = File.mtime(file)
  }
end

puts "Watching #{files.keys.join(', ')}\n\nFiles: #{files.keys.length}"

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
    puts "=> #{changed_file} changed, running #{command}"
    system(command)
    puts "=> done"
  end

end
