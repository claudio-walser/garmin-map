for file in `ls ./fit/*.fit`; do ./fit2json.py $file interpolate; done
