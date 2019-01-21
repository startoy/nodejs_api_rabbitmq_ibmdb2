mode=$1

export LOG_PATH=$(pwd)/console
export NODE_LOG_FILE='nodejs.log'

usage() {
  echo
  echo " Usage: $(basename ${0}) <command>"
  echo 
  echo " <command>: "
  echo "  s,start                        start nodejs"
  echo "  b,bg,background                run process in background"
  echo "  stop,remove                    stop process (background)"
  echo
}

stop() {
  echo 'Stopping process..';
  id=$(ps x | grep -v grep | grep 'Sl     0:00 node ./bin/www' | awk '{print $1}' )
  if [ -z "$id" ]
  then
    echo ' [-] No Nodejs process Running...'
  else
    kill -9 $id
    echo ' [-] pid['$id'] Killed!'
  fi
}

create_logger() {
  echo "Creating logger.."
  if [ -d "$LOG_PATH" ]
  then 
    echo " [-] Reset logger file"
    truncate -s 0 $LOG_PATH/$NODE_LOG_FILE
  else 
    echo " [-] Create dir  $LOG_PATH"
    mkdir $LOG_PATH
    echo " [-] Create file $NODE_LOG_FILE"
    touch $LOG_PATH/$NODE_LOG_FILE
  fi
  echo "Logger path: [$LOG_PATH/$NODE_LOG_FILE]"
}

run_bg() {
  NODE_ENV=$RB_NODE_ENV \
  WRITEDATALOGCONSOLE=$RB_WRITEDATALOGCONSOLE \
  WRITEDBLOGCONSOLE=$RB_WRITEDBLOGCONSOLE \
  WRITENODELOGCONSOLE=$RB_WRITENODELOGCONSOLE \
  ENABLEDB2=$RB_ENABLEDB2 \
  REPLYWAITTIME=$RB_REPLYWAITTIME \
  PAGESIZE=$RB_PAGESIZE \
  AMQPURI=$RB_AMQPURI \
  RPCQUEUE=$RB_RPCQUEUE \
  DBCODEPAGE=$RB_DBCODEPAGE \
  DBHOST=$RB_DBHOST \
  DBPORT=$RB_DBPORT \
  DBNAME=$RB_DBNAME \
  DBTABLE=$RB_DBTABLE \
  DBUSER=$RB_DBUSER \
  DBPWD=$RB_DBPWD \
  RBHOSTNAME=$RB_RBHOSTNAME \
  RBPORT=$RB_RBPORT \
  SELFQUEUE=$RB_SELFQUEUE \
  DIRECTQUEUE=$RB_DIRECTQUEUE \
  npm start > $LOG_PATH/$NODE_LOG_FILE 2>&1 &
}

run() {
  NODE_ENV=$RB_NODE_ENV \
  WRITEDATALOGCONSOLE=$RB_WRITEDATALOGCONSOLE \
  WRITEDBLOGCONSOLE=$RB_WRITEDBLOGCONSOLE \
  WRITENODELOGCONSOLE=$RB_WRITENODELOGCONSOLE \
  ENABLEDB2=$RB_ENABLEDB2 \
  REPLYWAITTIME=$RB_REPLYWAITTIME \
  PAGESIZE=$RB_PAGESIZE \
  AMQPURI=$RB_AMQPURI \
  RPCQUEUE=$RB_RPCQUEUE \
  DBCODEPAGE=$RB_DBCODEPAGE \
  DBHOST=$RB_DBHOST \
  DBPORT=$RB_DBPORT \
  DBNAME=$RB_DBNAME \
  DBTABLE=$RB_DBTABLE \
  DBUSER=$RB_DBUSER \
  DBPWD=$RB_DBPWD \
  RBHOSTNAME=$RB_RBHOSTNAME \
  RBPORT=$RB_RBPORT \
  SELFQUEUE=$RB_SELFQUEUE \
  DIRECTQUEUE=$RB_DIRECTQUEUE \
  npm start
}

read_env() {
  echo 'Read environment...'
  . env_new_container.sh 
}

if [ -z "$mode" ]
then
  echo ' Invalid Mode !'
  usage
else
  case $mode in
  start|begin|s)
    echo
    echo 'Mode [Start]'
    stop
    echo
    read_env
    run
    ;;
  b|background|bg|quiet|q)
    echo
    echo 'Mode [Background]'
    stop
    create_logger
    read_env
    echo 'Start Nodejs in background..'
    run_bg
    echo
    ;;
  stop|remove|rm)
    echo
    echo 'Mode [Stop]'
    stop
    echo
    ;;
  ps|process)
    echo
    echo 'Mode [Process]'
    ps x | grep -v grep | grep 'Sl     0:00 node ./bin/www'
    echo
    ;;
  '')
    echo ' Invalid Mode !'
    usage
    ;;
  *)
    echo ' Invalid Mode !'
    usage
    ;;
  esac
fi