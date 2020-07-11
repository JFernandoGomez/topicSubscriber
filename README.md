# Pangaea BE Coding Challenge

## Running the project
**Instalation**
* Clone the repo
* Install `npm install`
* Start the server `npm start`

The server is using port `3000` and is exposing the following endpoints:


| Endpoint          | method | description                                                                                                                                              |
|-------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| /publish/:topic   | POST   | Receives a `message<JSON>` as body, and `topic` as URI parameter. Will send the message to all subscribers from a topic.                                 |
| /subscribe/:topic | POST   | Receives a `message<JSON>` as body, and `topic` as URI parameter. Will subscribe a listener to a topic. **The subscription is unique for topic and url** |
| /listener         | POST   | Acts as a Listener example, will receive a body and just show the message back.                                                                          |

## Testing

For testing this could be executed in the terminal
```bash
$ curl -X POST -H "Content-Type: application/json" -d '{ "url": "http://localhost:3000/event"}' http://localhost:3000/subscribe/topic1

$ curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' http://localhost:3000/publish/topic1
```

# Todo:

## Unsubscribe
For enabling `automatic` or `delayed Unsubscription` from a topic, the next changes in the body received on `/subscribe/:topic` could be enabled for the *subscriber*:

```javascript
{
  url: string, // endpoint for the subscriber to listen for messages
  expire_time: timestamp, // a future date where the subscription should not be executed anymore
}
```

Once the `expire_time` is reached the request should filter subscribers which `expire_time > now`.

Also any of this two options could be enabled
* an `/unsubscribe/:topic` endpoint 
* add an option for the original `/subscribe/:topic` endpoint to handle this, as probably the `url & topic` would be require. Maybe `/subscribe/:topic/(terminate | unsubscribe)`

## Securing only self unsubcription

For avoiding other subscribers to be able to `unsubscribe` another subscriptions, after successfully subscribing a `hash | id` could be returned in the payload for the final user, which would be `required` for `unsubscribing` and posibly if another feature such as `editing a subscription` would be desired.

Another option is adding an **Authentication Layer**, and a `GET /subscriptions` endpoint for listing a subscribers own *subscriptions list*.

## Rennovating a subscription

If a `GET /subscriptions` and either an **Authentication Layer** or the `hash | id` options are enabled, the end user could search for expired subscriptions and then edit the `expire_time` following the previous section logic on `editing a subscription`.