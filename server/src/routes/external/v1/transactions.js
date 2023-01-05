// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { createWithdrawTransaction } = require("../../../controllers/coinbase");

const CryptoTransaction = require("../../../models/CryptoTransaction");

/**
 * @route   GET /api/external/v1/transactions/list
 * @desc    List all transactions at that time
 * @access  Private
 */
router.get("/list", async (req, res, next) => {
  try {
    const transactions = await CryptoTransaction.find()
      .sort({ created: -1 })
      .populate("_user", ["avatar", "username"]);

    return res.json(transactions);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/external/v1/transactions/lookup/:transactionId
 * @desc    Lookup a single transaction
 * @access  Private
 */
router.get("/lookup/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      _id: req.params.transactionId,
    }).populate("_user", ["username", "avatar"]);

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    return res.json(transaction);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/external/v1/transactions/confirm/:transactionId
 * @desc    Confirm a manual transaction
 * @access  Private
 */
router.post("/confirm/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      type: "withdraw",
      _id: req.params.transactionId,
      state: 4,
    });

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    // Create new payment using Coinpayments
    const newPayment = await createWithdrawTransaction(
      transaction.currency.toLowerCase(),
      transaction.address,
      Math.abs(transaction.siteValue),
      transaction.id
    );

    console.log("DEBUG:", newPayment.network);

    // Update document
    await CryptoTransaction.updateOne(
      { _id: transaction.id },
      {
        $set: {
          state: 3,
          txid: newPayment.network.hash,
          cryptoValue: Math.abs(parseFloat(newPayment.amount.amount)),
        },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/external/v1/transactions/cancel/:transactionId
 * @desc    Cancel a manual transaction
 * @access  Private
 */
router.post("/cancel/:transactionId", async (req, res, next) => {
  try {
    const transaction = await CryptoTransaction.findOne({
      type: "withdraw",
      _id: req.params.transactionId,
      state: 4,
    });

    // If user was not found
    if (!transaction) {
      res.status(404);
      return next(
        new Error("Couldn't find an transaction with that TransactionID!")
      );
    }

    // Update document
    await CryptoTransaction.updateOne(
      { _id: transaction.id },
      {
        $set: {
          state: 2,
        },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    return next(error);
  }
});
