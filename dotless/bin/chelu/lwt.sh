#!/bin/sh

echo "Mapping open ports to running processes. This will take several minutes to complete..."

IFS=:

netstat -aWn | grep -iv CLOSED | awk '/tcp|udp/ { 																\
													localportloc = match($4, /\.[^.]+$/);		 				\
													localportlen = RLENGTH;										\
																												\
													remoteportloc = match($5, /\.[^.]+$/);						\
													remoteportlen = RLENGTH;									\
																												\
													verb 		= "talking to ";								\
													protocol 	= toupper(substr($1, 1, 3));					\
													remoteip 	= substr($5, 1, remoteportloc - 1);				\
													port 		= substr($4, localportloc + 1, localportlen);	\
																												\
													if ( match(remoteip, /\*/) )								\
													{															\
														verb = "listening";										\
														remoteip = "";											\
													}															\
																												\
													if ( localportloc != 0 && match(port, /[0-9]+/) )			\
													{															\
														printf("%s:%s:%s:%s\n", verb, protocol, remoteip, port);\
													}															\
																												\
												}' | sort -r | uniq |
while read verb protocol remoteip port; do
			
	# printf "VERB: %s\t PROTOCOL: %s\t REMOTEIP: %s\t PORT: %s\n" "$verb" "$protocol" "$remoteip" "$port"
			
	lsof -i ":$port" | awk '/[0-9]/ { print $2 }' | sort | uniq |
	while read pid; do
		
		ps $pid -wo command | awk -v verb=$verb -v pid=$pid -v remoteip=$remoteip -v port=$port -v protocol=$protocol '/[\/]/ { printf("%s 	%s is %s%s on %s port %s\n", pid, $0, verb, remoteip, protocol, port) }'
	
	done

done

echo "Done!"
		
		
