var express = require("express");
var router = express.Router();
var client = require("../helpers/mongo");
const notifySubscriber = require("../helpers/notifier");

let connection;
client.connect((err, database) => {
	if (err) {
		throw error;
	}
	connection = database;
});

/* POST subscribe. */
router.post("/subscribe/:topic", function (req, res, next) {
	const { topic } = req.params;
	const { url } = req.body;

	if (!url) {
    res
				.status(400)
				.send(ErrorResponse(`Error in request malformed body it should be of type JSON, recieved: ${JSON.stringify(req.body)}`));
  }
  
	// Saving our subscriber somewhere
	const collection = connection.db("jordan").collection("subscribers");

	// build collection Document
	const item = { topic, url };

	// perform actions on the collection object
	collection.insertOne(item, (err, result) => {
		if (err) {
			// Error saving the document in the collection
			res
				.status(400)
				.send(ErrorResponse("Error Subscribing", { details: err.message }));
		} else {
			// Success saving the document in the collection
			res.send(SuccessResponse(`Successfully subscribed to topic: ${topic}`));
		}
	});
});

/* POST publish. */
router.post("/publish/:topic", async function (req, res, next) {
	const { topic } = req.params;
	const body = req.body;

	// I should be sending the message to all My subscribers
	const collection = connection.db("jordan").collection("subscribers");

	// perform actions on the collection object
	const subscribers = await collection.find({ topic }).toArray();

	// await for all httpRequests to finish
	const responses = await Promise.all(
		subscribers.map(async (subscriber) => {
			// do a POST for each subscriber
			try {
				await notifySubscriber(subscriber.url, body);
				return true;
			} catch (error) {
				return false;
			}
		})
	);

	const successfullNotifications = responses.filter((e) => !!e);
	if (successfullNotifications.length > 0) {
		res.send(
			SuccessResponse(
				`Message succesfully sent to ${successfullNotifications.length} subscribers of ${subscribers.length}.`
			)
		);
	} else {
		res.send(
			ErrorResponse(
				`No messages could be sent to ${subscribers.length} subscribers.`
			)
		);
	}
});

const ErrorResponse = (message, info) => {
	return {
		status: "ERROR",
		message,
		...info,
	};
};

const SuccessResponse = (message, ...info) => ({
	status: "SUCCESS",
	message,
	...info,
});

module.exports = router;
