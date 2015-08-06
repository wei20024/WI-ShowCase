#!/bin/sh
<<<<<<< HEAD
set +x
=======
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
  echo "Please Input Your Password and press enter to finish!"
  read ANS
  ../../../../jre/bin/java -jar ../../../lib/myHttp11.jar $ANS > 1.txt
  newpwd=`cat 1.txt`
  rm 1.txt
  oldpwd=`grep -i WI.ldaps.truststore.password ../WEB-INF/classes/controller.properties | awk '{print substr($0,30)}' | tr -d '\r'`
  key=WI.ldaps.truststore.password
  sed -i "/$key/s@$oldpwd@$newpwd@" ../WEB-INF/classes/controller.properties
  newpwdA=`grep -i WI.ldaps.truststore.password ../WEB-INF/classes/controller.properties | awk '{print substr($0,30)}' | tr -d '\r'`
  if [ "$newpwd" == "$newpwdA" ]; then
    echo modify success!
  else
    echo modify failed!
  fi
