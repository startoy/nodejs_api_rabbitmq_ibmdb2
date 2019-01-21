cmd=$1
cname=$2
container_name=$3
id=
config_file='docker_cid.cnf'
foo='bar'

# config
deploy_folder='deploy/*'

re_read_config() {
  docker_log='/var/lib/docker/containers/'$id'*/'$id'*-json.log'
}

usage() {
  echo
  echo " Usage: $(basename ${0}) <command> <cname>"
  echo 
  echo "  h, help                    show help usage"
  echo
  exit 1
}

help() {
  echo
  echo " Shell for maintenance nodejs-api: optimize for Docker"
  echo " Usage: $(basename ${0}) <command> <cname>"
  echo
  echo " <command>:"
  echo "  deploy               do cp, build, restart the container"
  echo "  start                start container"
  echo "  stop                 stop container"
  echo "  build                build source code in src/ to build/ in container"
  echo "  restart              restart container"
  echo "  cp                   copy all files in deploy/ folder to app/ in docker container process"
  echo "  log                  tail log docker container"
  echo "  cplog                copy logs/ folder from docker container to current directory"
  echo "  create <version>     create new docker container with settings from env_new_container.sh"
  echo "                        <version> - nodejs-api image version ex. 19.01.DB.06"
  echo "  config <cid>         create config file with container id for default use"
  echo
  echo " <cname>:"
  echo "  \$name               target container name (if no file docker_cid.cnf provide)"
  echo 
  echo " Docker console:"
  echo "  checklog             check docker console log file size in MB (Local)"
  echo "  truncate             truncate/clean docker console log file (when is too large)"
  echo
}

get_docker_cid_from_name() {
  echo 'finding container name ['$1']..';
  id=$(docker ps -a | grep $1 | awk '{print $1}')
}

read_config() {
if [ -z "$cname" ]
then
  if [ -e "$config_file" ] && [ -f "$config_file" ]
    then 
      echo 'Get container id from '$config_file
      id=$(<$config_file)
    else
    echo 'No file '$config_file', please create config or pass container name instead'
    exit 1
  fi
else
  echo 'Get container id from name ['$cname']';
  get_docker_cid_from_name $cname
fi
  
if [ -z "$id" ] 
  then
    echo 'Cannot get id from container name..'
    exit 1
  else
    echo 'Current container id ['$id']'
    re_read_config
  fi
}

cp() {
  echo 'Copy deploy/. to app/ '
  docker cp $deploy_folder $id:app/
  echo 'Restarting Container...'
  docker restart $id
}

log() {
  echo 'tail console log container..'
  docker logs -f $id
}

cplog() {
  echo 'Copy app/logs/ from container to current dir'
  docker cp $id:app/logs/ .
}

checklog() {
  ls -l $docker_log
  if [ -e "$docker_log" ] && [ -f "$docker_log" ]
  then
  echo '-> File size..'
  du -msh $docker_log
  echo -e '-----------------------------';
  else
  echo 'No file in '$docker_log'..'
  fi
}

trun_fnc() {

  echo 'truncate -s 0 /var/lib/docker/containers/'$id'/'$id'-json.log'
  if [ -e "$docker_log" ] && [ -f "$docker_log" ]
  then
  truncate -s 0 $docker_log
  else
  echo 'No file in '$docker_log'..'
  fi
}

start() {
  docker start $id
}

stop() {
  docker stop $id
}

build() {
  docker exec -it $id npm run build
}

restart() {
  docker restart $id
}

create_container() {
  if [ -z "$cname" ]
  then VERSION=''
  else VERSION=':'$cname
  fi

  if [ -z "$container_name" ]
  then container_name='nodejs-api'
  fi
  echo
  echo "Create container name [$container_name]"
  # Set ENV
  echo 'Exporting environment for create container...'
  chmod +x env_new_container.sh
  . env_new_container.sh

  echo 'Test echo $RB_NODE_ENV => ['$RB_NODE_ENV']'

  # Run Container
  docker run -it -d \
    -e "NODE_ENV=$RB_NODE_ENV" \
    -e "WRITEDATALOGCONSOLE=$RB_WRITEDATALOGCONSOLE" \
    -e "WRITEDBLOGCONSOLE=$RB_WRITEDBLOGCONSOLE" \
    -e "WRITENODELOGCONSOLE=$RB_WRITENODELOGCONSOLE" \
    -e "ENABLEDB2=$RB_ENABLEDB2" \
    -e "REPLYWAITTIME=$RB_REPLYWAITTIME" \
    -e "PAGESIZE=$RB_PAGESIZE" \
    -e "AMQPURI=$RB_AMQPURI" \
    -e "RPCQUEUE=$RB_RPCQUEUE" \
    -e "DBCODEPAGE=$RB_DBCODEPAGE" \
    -e "DBHOST=$RB_DBHOST" \
    -e "DBPORT=$RB_DBPORT" \
    -e "DBNAME=$RB_DBNAME" \
    -e "DBTABLE=$RB_DBTABLE" \
    -e "DBUSER=$RB_DBUSER" \
    -e "DBPWD=$RB_DBPWD" \
    -e "RBHOSTNAME=$RB_RBHOSTNAME" \
    -e "RBPORT=$RB_RBPORT" \
    -e "SELFQUEUE=$RB_SELFQUEUE" \
    -e "DIRECTQUEUE=$RB_DIRECTQUEUE" \
    --name $container_name \
    -p 15673:15673 \
    fwg/nodejs-api$VERSION \
    npm start
}

create_config() {
  if [ -e "$config_file" ] && [ -f "$config_file" ]
    then
      echo 'replace new container id to file '$config_file'..'
      #truncate -s 0 $config_file
      echo $cname > $config_file
   else
     echo 'create new config file '$config_file'..'
     #touch $config_file
     echo $cname > $config_file
  fi
 echo 'save config file done..'
}

if [ -z "$foo" ]
  then
  echo 'Not start shell'
else
# for those not sent parameter $2 as container id
  case $cmd in
    h|help)
      help
      exit 1
      ;;
    config|cnf)
      create_config
      exit 1
      ;;
    create)
      create_container
      exit 1
      ;;
    '')
      usage
      exit 1
      ;;
  esac
  echo
# for those who want use default container id or pass param $2
  read_config
  case $cmd in
    d|deploy)
      cp
      build
      restart
      ;;
    s|start)
      start
      ;;
    st|stop)
      stop
      ;;
    b|build)
      build
      ;;
    r|restart)
      restart
      ;;
    cp)
      cp
      ;;
    log)
      log
      ;;
    cplog)
      cplog
      ;;
    checklog)
      checklog
      ;;
    trun|truncate)
      trun_fnc
      ;;
    *)
      usage
      exit 1
      ;;
  esac
  echo 'Exit shell..'
fi