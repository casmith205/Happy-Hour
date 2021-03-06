// Dependencies
// =============================================================
// Requiring our model
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the deals
    app.get("/", function (req, res) {
        db.Deal.findAll({
            include: [db.Restaurant]
        })
            .then(function (result) {
                var dealObj = {
                    deals: result
                }
                res.render("restaurant", dealObj);
            })
            .catch(function (err) {
                res.status(500).send(err);
            })
    });

    // GET route for getting CERTAIN deals
    app.get("/api/deals/search", function (req, res) {
        console.log("query params: ", req.query)
        db.Deal.findAll({
            include: [db.Restaurant],
            where: {
                deal_type: req.query.deal_type,
                day: req.query.day,
                start_time: {
                    $lte: req.query.start_time
                },
                end_time: {
                    $gte: req.query.start_time
                }
            }

        })
            .then(function (results) {
                res.json(results)
            })
            .catch(function (err) {
                res.status(500).send(err);
            })
    });

    // POST route for saving a new deal
    app.post("/api/deals", function (req, res) {
        db.Deal.create({
            deal_description: req.body.deal_description,
            day: req.body.day,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            restrictions: req.body.restrictions,
            deal_type: req.body.deal_type,
            RestaurantId: req.body.RestaurantId
        })
            .then(function (result) {
                // res.json(result);
                res.status(200).end()
            })
            .catch(function (err) {
                res.status(500).send(err);
            })
    });

    // PUT route for updating deals
    app.put("/api/deals/:id", function (req, res) {
        db.Deal.update(req.body,
            {
                where: {
                    id: req.params.id
                }
            })
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.status(500).send(err);
            })
    });
};