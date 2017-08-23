#!/usr/bin/env python
# -*- coding: utf-8 -*-

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
    sport['start']['dateobject'] = sport['start']['dateobject'].strftime('%Y-%m-%d %H:%M:%S')
    sport['end']['dateobject'] = sport['end']['dateobject'].strftime('%Y %d %m %H:%M:%S')

    for point in sport['points']:
        dateTime = point['dateobject']
        point['dateobject'] = dateTime.strftime('%Y-%m-%d %H:%M:%S')
        point['datetime'] = dateTime.strftime('%Y/%m/%d %H:%M:%S')
        point['time'] = dateTime.strftime('%H:%M:%S')
        point['date'] = dateTime.strftime('%Y-%m-%d')

    return sport

def interpolateLinear(start, end):
    timeDiff = end['dateobject'] - start['dateobject']
    num = timeDiff.seconds - 1

    if num == 0:
        return []

    interpolated = []

    # calculate coordinates steps
    latDiff = end['lat'] - start['lat']
    lngDiff = end['lng'] - start['lng']

    latSteps = latDiff / num
    lngSteps = lngDiff / num

    # calculate altitude steps
    if start['altitude'] > end['altitude']:
        altitudeDiff = start['altitude'] - end['altitude']
    else:
        altitudeDiff = end['altitude'] - start['altitude']

    if altitudeDiff > 0:
        altitudeStep = altitudeDiff / num
    else:
        altitudeStep = 0

    # calculate speed steps
    if start['speed'] > end['speed']:
        speedDiff = start['speed'] - end['speed']
    else:
        speedDiff = end['speed'] - start['speed']

    if speedDiff > 0:
        speedStep = speedDiff / num
    else:
        speedStep = 0


    # calculate temperature steps
    if start['temperature'] > end['temperature']:
        temperatureDiff = start['temperature'] - end['temperature']
    else:
        temperatureDiff = end['temperature'] - start['temperature']

    if temperatureDiff > 0:
        temperatureStep = temperatureDiff / num
    else:
        temperatureStep = 0


    for i in range(0, num):
        currentStep = i+1        

        # interpolate coordinates
        latTarget = start['lat'] + (currentStep * latSteps)
        lngTarget = start['lng'] + (currentStep * lngSteps)

        # interpolate altitude
        if altitudeDiff == 0:
            altitudeTarget = start['altitude']
        elif start['altitude'] > end['altitude']:
            altitudeTarget = start['altitude'] - (altitudeStep * currentStep)
        else:
            altitudeTarget = start['altitude'] + (altitudeStep * currentStep)

        altitudeTarget = round(altitudeTarget, 2)

        # interpolate speed
        if speedDiff == 0:
            speedTarget = start['speed']
        elif start['speed'] > end['speed']:
            speedTarget = start['speed'] - (speedStep * currentStep)
        else:
            speedTarget = start['speed'] + (speedStep * currentStep)

        speedTarget = round(speedTarget, 2)

        # interpolate temperature
        if temperatureDiff == 0:
            temperatureTarget = start['temperature']
        elif start['temperature'] > end['temperature']:
            temperatureTarget = start['temperature'] - (temperatureStep * currentStep)
        else:
            temperatureTarget = start['temperature'] + (temperatureStep * currentStep)

        temperatureTarget = int(temperatureTarget)

        point = {
            'type': 'interpolated',
            'altitude': altitudeTarget,
            'speed': speedTarget,
            'temperature': temperatureTarget,
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


for sportRecord in fitfile.get_messages('sport'):
    for record_data in sportRecord:
        if record_data.name == 'name':
            sport['type'] = record_data.value


# for sportRecord in fitfile.get_messages('event'):
#     for record_data in sportRecord:
#         if record_data.name == 'timestamp':
#             sport['datetime'] = str(record_data.value)

lastPoint = False
maxSpeed = False
minSpeed = False
maxAltitude = False
minAltitude = False

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
            sportRecord['altitude'] = round(record_data.value, 2)

        if record_data.name == 'speed':
            sportRecord['speed'] = round(record_data.value, 2)

        if record_data.name == 'temperature':
            sportRecord['temperature'] = record_data.value

        if record_data.name == 'position_lat':
            sportRecord['lat'] = semicircleToGradient(record_data.value)

        if record_data.name == 'position_long':
            sportRecord['lng'] = semicircleToGradient(record_data.value)

        if record_data.name == 'timestamp':
            sportRecord['dateobject'] = record_data.value



    if minSpeed is False:
        minSpeed = sportRecord['speed']
        
    if maxSpeed is False:
        maxSpeed = sportRecord['speed']
    

    if sportRecord['speed'] < minSpeed:
        minSpeed = sportRecord['speed']

    if sportRecord['speed'] > maxSpeed:
        maxSpeed = sportRecord['speed']
    

    if minAltitude is False:
        minAltitude = sportRecord['altitude']

    if maxAltitude is False:
        maxAltitude = sportRecord['altitude']

    if sportRecord['altitude'] < minAltitude:
        minAltitude = sportRecord['altitude']

    if sportRecord['altitude'] > maxAltitude:
        maxAltitude = sportRecord['altitude']

    if interpolate and lastPoint and sportRecord['lat'] and sportRecord['lng']:
        interpolatedPoints = interpolateLinear(lastPoint, sportRecord)
        for interpolatedPoint in interpolatedPoints:
            sport['points'].append(interpolatedPoint)

    if sportRecord['lat'] and sportRecord['lng']:
        lastPoint = sportRecord
        sport['points'].append(sportRecord)

firstPoint = sport['points'][0]
lastPoint = sport['points'][-1]


start = {
    'lat': firstPoint['lat'],
    'lng': firstPoint['lng'],
    'dateobject': firstPoint['dateobject']
}

gmaps = googlemaps.Client(key=gMapsKey)
reverse_geocode_result = gmaps.reverse_geocode((start['lat'], start['lng']))

sport['location'] = reverse_geocode_result[0]['address_components'][2]['long_name']
sport['start'] = start

sport['end'] = {
    'lat': lastPoint['lat'],
    'lng': lastPoint['lng'],
    'dateobject': lastPoint['dateobject']   
}
timeDiff = lastPoint['dateobject'] - firstPoint['dateobject']
sport['duration'] = timeDiff.total_seconds()

sport['speed'] = {
    'min': minSpeed,
    'max': maxSpeed,
}

sport['altitude'] = {
    'min': minAltitude,
    'max': maxAltitude,
}

targetDirectory = "./out/%s" % (sport['start']['dateobject'].strftime("%Y-%m-%d"))
if not os.path.isdir(targetDirectory):
    os.mkdir(targetDirectory)

filename = "%s/%s-%s-%s.json" % (targetDirectory, sport['type'], sport['location'], sport['start']['dateobject'].strftime('%H:%M:%S'))
with open(filename, "w") as jsonFile:
    jsonFile.write(json.dumps(stringifyDatetime(sport), sort_keys=True, indent=4))


print("Json File %s successfully written!" % (filename))
sys.exit(0)
