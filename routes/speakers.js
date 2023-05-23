const express = require("express");
const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;
  router.get("/", async (req, res, next) => {
    try {
      const artwork = await speakersService.getAllArtwork();
      const speakers = await speakersService.getList();
      res.render("layout", {
        pageTitle: "Speakers",
        template: "speakers",
        speakers,
        artwork,
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:shortname", async (req, res, next) => {
    try {
      const artwork = await speakersService.getArtworkForSpeaker(
        req.params.shortname
      );
      const speaker = await speakersService.getSpeaker(req.params.shortname);
      res.render("layout", {
        pageTitle: "Speaker",
        template: "speakers-detail",
        speaker,
        artwork,
      });
    } catch (err) {
      next(err);
    }
  });
  return router;
};
