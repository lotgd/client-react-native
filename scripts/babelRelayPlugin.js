'use strict'

const getBabelRelayPlugin = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request = require('sync-request')

const url = 'http://127.0.0.1:8000/'

const response = request('POST', url, {
    'headers': {
        'Content-Type': 'application/graphql'
    },
    'body': introspectionQuery
})

const schema = JSON.parse(response.body.toString('utf-8'))

module.exports = getBabelRelayPlugin(schema.data, { abortOnError: true })
