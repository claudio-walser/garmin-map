#!/usr/bin/env python

from fitparse import FitFile
from datetime import timedelta, datetime
from pprint import pprint
import sys
import json
import os
import googlemaps


def semicircleToGradient(semicircle):
    return int(semicircle) * ( 180.0 / 2 ** 31 )

def stringifyDatetime(sport):
    for point in sport['points']:
        dateTime = point['dateobject']
        point['dateobject'] = dateTime.strftime('%Y-%m-%d %H:%M:%S')
        point['datetime'] = dateTime.strftime('%Y-%m-%d %H:%M:%S')
        point['time'] = dateTime.strftime('%H:%M:%S')
        point['date'] = dateTime.strftime('%Y-%m-%d')

    return sport

def interpolateLinear(start, end):
    timeDiff = end['dateobject'] - start['dateobject']
    num = timeDiff.seconds - 1

    interpolated = []

    latDiff = end['lat'] - start['lat']
    lngDiff = end['lng'] - start['lng']
    if num == 0:
        return []

    latSteps = latDiff / num
    lngSteps = lngDiff / num

    for i in range(0, num):
        currentStep = i+1        

        latTarget = start['lat'] + (currentStep * latSteps)
        lngTarget = start['lng'] + (currentStep * lngSteps)

        point = {
            'type': 'interpolated',
            'altitude': start['altitude'],
            'speed': start['speed'],
            'temperature': start['temperature'],
            'lat': latTarget,
            'lng': lngTarget,
            'dateobject': start['dateobject'] + timedelta(seconds=currentStep)
        }

        interpolated.append(point)

    #return []
    return interpolated 


if len(sys.argv) < 2:
    print("Give a fitfile as the only parameter")
    sys.exit(1)

with file('.google-maps-key') as f:
    gMapsKey = f.read()

fitFilename = sys.argv[1]
interpolate = False
if len(sys.argv) is 3:
    interpolate = True

if not os.path.isfile(fitFilename):
    print("Cannot find given fitfile: %s" % (fitFilename))
    sys.exit(1)    

fitfile = FitFile(fitFilename)

# print "record"
# for record in fitfile.get_messages('record'):

#     # Go through all the data entries in this record
#     for record_data in record:

#         # Print the records name and value (and units if it has any)
#         if record_data.units:
#             print " * %s: %s %s" % (
#                 record_data.name, record_data.value, record_data.units,
#             )
#         else:
#             print "* %s: %s" % (record_data.name, record_data.value)
#     print
# sys.exit(1)


sport = {
    'type': False,
    'location': False,
    'start': {
        'lat': False,
        'lng': False
    },
    'end': {
        'lat': False,
        'lng': False
    },
    'speed': {
        'min': False,
        'max': False
    },
    'datetime': False,
    'points': []

}  

start = {}
for record in fitfile.get_messages('session'):

    # Go through all the data entries in this record
    for record_data in record:
        if record_data.name == 'start_position_lat':
            start['lat'] = semicircleToGradient(record_data.value)
        if record_data.name == 'start_position_long':
            start['lng'] = semicircleToGradient(record_data.value)

gmaps = googlemaps.Client(key=gMapsKey)
reverse_geocode_result = gmaps.reverse_geocode((start['lat'], start['lng']))

sport['location'] = reverse_geocode_result[0]['address_components'][2]['long_name']
sport['start'] = start
for sportRecord in fitfile.get_messages('sport'):
    for record_data in sportRecord:
        if record_data.name == 'name':
            sport['type'] = record_data.value


for sportRecord in fitfile.get_messages('event'):
    for record_data in sportRecord:
        if record_data.name == 'timestamp':
            sport['datetime'] = str(record_data.value)


for sportRecord in fitfile.get_messages('record'):
    for record_data in sportRecord:
        if record_data.name == 'timestamp':
            sport['datetime'] = str(record_data.value)

lastPoint = False
maxSpeed = False
minSpeed = False

for record in fitfile.get_messages('record'):

    sportRecord = {
        'type': 'recorded',
        'altitude': False,
        'speed': False,
        'temperature': False,
        'lat': False,
        'lng': False,
        'datetime': False,
        'date': False,
        'time': False
    }

    # Go through all the data entries
    for record_data in record:
        if record_data.name is 'altitude':
            sportRecord['altitude'] = record_data.value

        if record_data.name == 'speed':
            sportRecord['speed'] = record_data.value

        if record_data.name == 'temperature':
            sportRecord['temperature'] = record_data.value

        if record_data.name == 'position_lat':
            sportRecord['lat'] = semicircleToGradient(record_data.value)

        if record_data.name == 'position_long':
            sportRecord['lng'] = semicircleToGradient(record_data.value)

        if record_data.name == 'timestamp':
            sportRecord['dateobject'] = record_data.value
            sportRecord['datetimestring'] = str(record_data.value)



    if minSpeed is False:
        minSpeed = sportRecord['speed']
        
    if maxSpeed is False:
        maxSpeed = sportRecord['speed']
    

    if sportRecord['speed'] < minSpeed:
        minSpeed = sportRecord['speed']

    if sportRecord['speed'] > maxSpeed:
        maxSpeed = sportRecord['speed']
    
    if interpolate and lastPoint and sportRecord['lat'] and sportRecord['lng']:
        interpolatedPoints = interpolateLinear(lastPoint, sportRecord)
        for interpolatedPoint in interpolatedPoints:
            sport['points'].append(interpolatedPoint)

    if sportRecord['lat'] and sportRecord['lng']:
        lastPoint = sportRecord
        sport['points'].append(sportRecord)




sport['end'] = {
    'lat': lastPoint['lat'],
    'lng': lastPoint['lng']
}
sport['speed'] = {
    'min': minSpeed,
    'max': maxSpeed
}

filename = "./out/%s-%s-%s.json" % (sport['type'], sport['location'], sport['datetime'])
with open(filename, "w") as jsonFile:
    jsonFile.write(json.dumps(stringifyDatetime(sport), sort_keys=True, indent=4))


print("Json File %s successfully written!" % (filename))
sys.exit(0)
