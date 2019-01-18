# process
export RB_NODE_ENV='development'
export RB_WRITEDATALOGCONSOLE='no'
export RB_WRITEDBLOGCONSOLE='yes'
export RB_WRITENODELOGCONSOLE='yes'
export RB_ENABLEDB2='yes'
export RB_REPLYWAITTIME=6000
export RB_PAGESIZE=20
# RabbitMQ
export RB_AMQPURI='amqp://172.17.0.2'
# Queue
export RB_RPCQUEUE='test_queue'
# Database
export RB_DBCODEPAGE='874'
export RB_DBHOST='10.22.19.13'
export RB_DBPORT='50001'
export RB_DBNAME='fisdb_nt'
export RB_DBTABLE='SECCALLFORCERATETAB'
export RB_DBUSER='db2inst1'
export RB_DBPWD='db2inst1'

# Didn't use
export RB_RBHOSTNAME='localhost'
export RB_RBPORT='15672'
export RB_SELFQUEUE='rabbit.reply-to'
export RB_DIRECTQUEUE='directQueue'