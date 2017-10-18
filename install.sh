#!/bin/bash

if [ -z $1 ]
then 
	echo provide meteor directory
else
	rm -r $1/client
	cp -r * $1/
fi
