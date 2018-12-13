#!/usr/bin/bash

iTemp=0;
if [ -z "${1}" ]; then echo 'Usage: '${0}' <port> <msg1> <msg2>...'; echo '   EX -> '${0}' 3000 AMU1017,10170012%20%20,1,10 ATF500%20,10,,9';exit; fi
if [ -z "${2}" ]; then default="AMU1017,10170012%20%20,1,10";
else
        for ARG in "${@:2}"
        do
        default[iTemp]=$ARG;
        echo 'Request:'${default[iTemp]};
        iTemp=$((iTemp+1));
        done
fi;

echo '--------- Start Loop in 3 second... ---------';
if [ "${iTemp}" -eq 0 ]; then echo 'Request:'$default; iTemp=1; fi
sleep 3;

t_count=0;
g_count=0;
g_sum=0;
count=0;
l_count=0;

stime=$(date +%s%3N);
while true;
do
        count=$((count+1));
        t_count=$((t_count+1));
        echo "  --------------------------------------------------------------------------------------";
                rnd=$(( $RANDOM % $iTemp ));
                Msg=${default[$rnd]};
                echo 'Will Request -> '$Msg;
        RES=$(curl -m 10 localhost:${1}/rpc/test_queue/${Msg});
        if [ -z "${RES}" ]; then l_count=$((l_count+1));
        else echo $RES; fi
done 