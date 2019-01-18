cmd=$1
cname=$2
id=
config_file='docker_cid.cnf'
foo='bar'

# config
deploy_folder='deploy/'

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
  id=$(docker ps | grep $1 | awk '{print $1}')
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
  echo 'Copy deploy/ to app/ '
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

create_config() {
  if [ -e "$config_file" ] && [ -f "$config_file" ]
    then
      echo 'save new container id to file '$config_file'..'
      #truncate -s 0 $config_file
      echo $cname > $config_file
   else
     echo 'create new config file '$config_file'..'
     touch $config_file
     echo $cname >> $config_file
  fi
 echo 'save config file done..'
}

if [ -z "$foo" ]
  then
  echo 'Not start shell'
else
  case $cmd in
    h|help)
      help
      exit 1
      ;;
    config|cnf)
      create_config
      ;;
    '')
      usage
      exit 1
      ;;
  esac
  echo
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