const router = require("express").Router();
const Feed = require("../model/feed.model");
const verify = require("./verifyToken");

router.route("/").get((req, res) => {
  Feed.find()
    .populate("user")
    .sort({ "createdAt": -1 })
    .then(feeds => res.json(feeds))
    .catch(err => res.status(400).json("Error: " + err));
});

router.post("/add", verify, async (req, res) => {
  console.log(req.user);
  const feed = new Feed({
    user: req.user._id,
    content: req.body.content
  });

  try {
    const savedFeed = await feed.save();
    const savedFeedWithUserData = await Feed.findById(savedFeed._id).populate(
      "user"
    );
    res.send(savedFeedWithUserData);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.put("/update", verify, async (req, res) => {
  console.log(req.user);
  try {
    await Feed.findByIdAndUpdate(req.body._id, {
      upvote: req.body.upvote,
      downvote: req.body.downvote
    });
    res.send({ "success": true });
  } catch {
    req.sendStatus(400);
  }
});

module.exports = router;
