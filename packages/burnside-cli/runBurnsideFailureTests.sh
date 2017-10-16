#!/bin/bash

if node src/cli.js --startup='./exampleServer.sh' --condition='foo' --wait=100 ./src/index.test.js  >> /dev/null ;
then
    echo 'FAIL ** Burnside should timeout when waiting for something that never happens **'
    exit 1
else
    echo 'PASS ** Burnside should timeout when waiting for something that never happens **'
fi

if node src/cli.js --startup=./missing.sh --condition='foo' ./src/index.test.js  >> /dev/null ;
then
    echo 'FAIL ** Burnside should fail to invoke a script that doesnt exist **'
    exit 1
else
    echo 'PASS ** Burnside should fail to invoke a script that doesnt exist **'
fi