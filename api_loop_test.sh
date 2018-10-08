iTemp=0;
if [ -z "${1}" ]; then echo 'Usage: request_rabbit_loop.sh <port> <msg> <msg>...'; echo '   EX -> ./repeat.sh 8080 APF50050005%20%20,F,5005,,1,8 ATF500%20,10,,9';exit; fi
if [ -z "${2}" ]; then default="APF50050005%20%20,F,5005,,1,8";
else
        for ARG in "${@:2}"
        do
        default[iTemp]=$ARG;
        echo 'Request:'${default[iTemp]};
        iTemp=$((iTemp+1));
        done
fi;

echo '--------- Start Loop in 5 second... ---------';
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

        etime=$(date +%s%3N);
        dtime=$((${etime}-${stime}));
        if [ ${dtime} -gt 1000 ]; then
                g_count=$((g_count+1));
								g_sum=$((g_sum+dtime));
                time_avg=$((g_sum/g_count));
                msg_avg=$((t_count/g_count));
                msg_time_avg=$((msg_avg/time_avg));

                echo " ";
                echo ' ************* Summary *************';
                echo ' --- THIS ROUND --- ';
                echo '  Msg Request: '$count;
                echo '  Time Usage : '$dtime;
                echo ' --- TOTAL --- ';
                echo '  Round:    ' $g_count;
                echo '  Messages: ' ${t_count};
                echo '  Lost:     ' ${l_count};
                echo '  Time AVG: '$(echo "scale=3;$g_sum/$g_count" | bc -l)'ms';
                # echo '  Time AVG: ' $g_sum'/'$g_count     '='$(echo "scale=3;$g_sum/$g_count" | bc -l);
                echo '  Msg AVG:  '$(echo "scale=3;$t_count/$g_count" | bc -l)'/1ms';
                # echo '  Msg AVG:  ' $t_count'/'$g_count   '='$(echo "scale=3;$t_count/$g_count" | bc -l);
                # echo ' Msg/Time AVG: ' $msg_avg'/'$time_avg'='$(echo "scale=3;$msg_avg/$time_avg" | bc -l);
                sleep 4;
                count=0;
                stime=$(date +%s%3N);
        fi
done 