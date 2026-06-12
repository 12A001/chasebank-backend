import Transaction from '../models/Transaction.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

/* =========================================
   GET USER TRANSACTIONS
========================================= */
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(transactions)
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch transactions',
    })
  }
}

/* =========================================
   GET SINGLE TRANSACTION
========================================= */
export const getSingleTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id)

    if (!tx) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    res.json(tx)
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch transaction',
    })
  }
}

/* =========================================
   SEND MONEY
========================================= */
export const sendMoney = async (req, res) => {
  const session = await mongoose.startSession()

  session.startTransaction()

  try {
    const senderId = req.user._id

    const {
      accountNumber,
      amount,
      note,
    } = req.body

    const sender = await User.findById(senderId).session(session)

    const receiver = await User.findOne({
      accountNumber,
    }).session(session)
    if (sender.isFrozen) {
  await session.abortTransaction()

  return res.status(403).json({
    message:
      sender.frozenReason ||
      'Your account has been frozen'
  })
}

    if (!receiver) {
      await session.abortTransaction()

      return res.status(404).json({
        message: 'Receiver not found',
      })
    }

    if (sender.balance < amount) {
      await session.abortTransaction()

      return res.status(400).json({
        message: 'Insufficient balance',
      })
    }

    /* DEDUCT SENDER */
    sender.balance -= Number(amount)

    /* ADD RECEIVER */
    receiver.balance += Number(amount)

    /* SAVE USERS */
    await sender.save({ session })
    await receiver.save({ session })

    /* SENDER TRANSACTION */
    await Transaction.create(
      [
        {
          userId: sender._id,

          accountName: receiver.fullName,
          accountNumber: receiver.accountNumber,

          senderName: sender.fullName,
          senderAccountNumber: sender.accountNumber,

          receiverName: receiver.fullName,
          receiverAccountNumber: receiver.accountNumber,

          bank: 'Chase Bank',

          amount,

          direction: 'sent',

          note: note || '',
        },
      ],
      { session }
    )

    /* RECEIVER TRANSACTION */
    await Transaction.create(
      [
        {
          userId: receiver._id,

          accountName: sender.fullName,
          accountNumber: sender.accountNumber,

          senderName: sender.fullName,
          senderAccountNumber: sender.accountNumber,

          receiverName: receiver.fullName,
          receiverAccountNumber: receiver.accountNumber,

          bank: 'Chase Bank',

          amount,

          direction: 'received',

          note: note || '',
        },
      ],
      { session }
    )

    await session.commitTransaction()

    res.json({
      message: 'Transfer successful',
      balance: sender.balance,
    })
  } catch (err) {
    console.log(err)

    await session.abortTransaction()

    res.status(500).json({
      message: 'Transfer failed',
    })
  } finally {
    session.endSession()
  }
}