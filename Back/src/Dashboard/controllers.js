import { getScoreDistributionService, getSummaryService, getTrendService } from "./service.js";

export const getSummary = async (req, res, next) => {
  try {
    const data = await getSummaryService();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

export const getTrend = async (req, res, next) => {
  try {
    const { group_by = 'day' } = req.query;

    if (!['day', 'week', 'month'].includes(group_by)) {
      return res.status(400).json({
        ok: false,
        message: "group_by debe ser 'day', 'week' o 'month'",
      });
    }

    const data = await getTrendService(group_by);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

export const getScoreDistribution = async (req, res, next) => {
  try {
    const data = await getScoreDistributionService();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};