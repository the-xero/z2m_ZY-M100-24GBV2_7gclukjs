const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const definition = {
    fingerprint: [
        {
            modelID: 'TS0601',
            manufacturerName: '_TZE204_7gclukjs',
        },
    ],
    model: 'ZY-M100-24GV2',
    vendor: 'TuYa',
    description: '24G Presense Sensor',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    onEvent: tuya.onEventSetTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
	exposes: [

		exposes.enum('state', ea.STATE, ['none', 'presence', 'move'])
		.withDescription('presence status'),

		e.presence().withDescription('not at home'),


		exposes.numeric('distance', ea.STATE)
		.withDescription('distance'),

		e.illuminance_lux(),

		exposes.numeric('radar_sensitivity', ea.STATE_SET).withValueMin(1)
		.withValueMax(10)
		.withValueStep(1)
		.withDescription('radar_sensitivity'),

		exposes.numeric('presence_sensitivity', ea.STATE_SET).withValueMin(1)
		.withValueMax(10)
		.withValueStep(1)
		.withDescription('presence_sensitivity'),

		exposes.numeric('detection_distance_min', ea.STATE_SET).withValueMin(0)
		.withValueMax(8.25)
		.withValueStep(0.75)
		.withUnit('m').withDescription('detection_distance_min'),

		exposes.numeric('detection_distance_max', ea.STATE_SET).withValueMin(0.75)
		.withValueMax(9)
		.withValueStep(0.75)
		.withUnit('m').withDescription('detection_distance_max'),

		exposes.numeric('keep_time', ea.STATE_SET).withValueMin(1)
		.withValueMax(15000)
		.withValueStep(1)
		.withUnit('s').withDescription('keep_time'),



	],
    meta: {
		multiEndpoint: true,
		tuyaDatapoints: [
			[104, 'presence', tuya.valueConverter.trueFalse1],
			[2, 'radar_sensitivity', tuya.valueConverter.raw],
			[102, 'presence_sensitivity', tuya.valueConverter.raw],

			[3, 'detection_distance_min', tuya.valueConverter.divideBy100],
			[4, 'detection_distance_max', tuya.valueConverter.divideBy100],

			[9, 'distance', tuya.valueConverter.divideBy10],


			[105, 'keep_time', tuya.valueConverter.raw],
			[103, 'illuminance_lux', tuya.valueConverter.raw],
			[1, 'state', tuya.valueConverterBasic.lookup({
				'none': 0,
				'presence': 1,
				'move': 2
			})],

		],
    },
    extend: [
        // A preferred new way of extending functionality.
    ],
};

module.exports = definition;
