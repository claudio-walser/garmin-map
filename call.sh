for file in `ls ./fit/*.fit`; do python ./fit2json.py $file interpolate; done
