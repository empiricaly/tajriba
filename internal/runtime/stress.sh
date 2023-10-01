#/bin/bash

for i in $(seq 100); do
  ginkgo -v
  ret=$?
  
  if [ $ret -ne 0 ]; then 
    if [ $ret -ne 197 ]; then 
      break
    fi
  fi
done
