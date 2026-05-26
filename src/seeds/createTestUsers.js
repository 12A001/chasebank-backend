import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

dotenv.config()

const users = [
  {
    fullName: 'Sandra Harrison',
    email: 'harrisonfanadez@gmail.com',
    username: 'SandraH',
    password: '25350011',
    accountNumber: '2749185301',
    phone: '+1-970-165-8909',
    ssn: '519-01-0001',
    balance: 900000,
    accountType: 'checking',
    address: '148 Yellow Street, Los Gatos, USA',
    birthday: new Date('1989-09-17'),
    loginPin: '25350011',
    transferPin: '2535',
  },

  {
    fullName: 'Michael Johnson',
    email: 'michael.johnson@gmail.com',
    username: 'michaelj',
    password: '09033125',
    accountNumber: '3816402759',
    phone: '+1-415-222-0198',
    ssn: '529-11-2299',
    balance: 320000,
    accountType: 'savings',
    address: '22 Sunset Boulevard, Los Angeles, California, USA',
    birthday: new Date('1995-09-21'),
    loginPin: '88221144',
    transferPin: '7788',
  },

  {
    fullName: 'Emily Carter',
    email: 'emily.carter@gmail.com',
    username: 'emilyc',
    password: '25358855',
    accountNumber: '4902817364',
    phone: '+1-646-555-1120',
    ssn: '611-28-9012',
    balance: 450000,
    accountType: 'checking',
    address: '58 Madison Avenue, New York, USA',
    birthday: new Date('1994-06-18'),
    loginPin: '55224488',
    transferPin: '2244',
  },

  {
    fullName: 'Daniel Brooks',
    email: 'daniel.brooks@gmail.com',
    username: 'danielb',
    password: '26467890',
    accountNumber: '5629183740',
    phone: '+1-312-555-7761',
    ssn: '712-19-3344',
    balance: 670000,
    accountType: 'savings',
    address: '900 Lake Shore Drive, Chicago, Illinois, USA',
    birthday: new Date('1992-11-03'),
    loginPin: '66117722',
    transferPin: '1177',
  },

  {
    fullName: 'Olivia Bennett',
    email: 'olivia.bennett@gmail.com',
    username: 'oliviab',
    password: '78051234',
    accountNumber: '7482916350',
    phone: '+1-416-555-9182',
    ssn: '811-77-2201',
    balance: 510000,
    accountType: 'checking',
    address: '120 King Street West, Toronto, Ontario, Canada',
    birthday: new Date('1996-08-14'),
    loginPin: '44558899',
    transferPin: '5588',
  },

  {
    fullName: 'Liam Thompson',
    email: 'liam.thompson@gmail.com',
    username: 'liamt',
    password: 'Liam@123',
    accountNumber: '8301649275',
    phone: '+1-604-555-1190',
    ssn: '844-22-7711',
    balance: 290000,
    accountType: 'savings',
    address: '88 Granville Street, Vancouver, British Columbia, Canada',
    birthday: new Date('1993-04-27'),
    loginPin: '77441122',
    transferPin: '4411',
  },

  {
    fullName: 'Sophia Wilson',
    email: 'sophia.wilson@gmail.com',
    username: 'sophiaw',
    password: 'Sophia@123',
    accountNumber: '9182736450',
    phone: '+1-514-555-0082',
    ssn: '855-44-1190',
    balance: 840000,
    accountType: 'checking',
    address: '45 Rue Sainte-Catherine, Montreal, Quebec, Canada',
    birthday: new Date('1997-12-09'),
    loginPin: '99887711',
    transferPin: '8877',
  },

  {
    fullName: 'Noah Mitchell',
    email: 'noah.mitchell@gmail.com',
    username: 'noahm',
    password: 'Noah@123',
    accountNumber: '6453728190',
    phone: '+1-403-555-7721',
    ssn: '866-10-4488',
    balance: 730000,
    accountType: 'savings',
    address: '300 Downtown Plaza, Calgary, Alberta, Canada',
    birthday: new Date('1991-01-30'),
    loginPin: '22334455',
    transferPin: '3344',
  },
]

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('🌱 Seeding database...')

    await User.deleteMany({})
    await Transaction.deleteMany({})

    const createdUsers = []

    for (let user of users) {
      const hashedPassword = await bcrypt.hash('25358711', 10)
      const hashedLoginPin = await bcrypt.hash(user.loginPin, 10)
      const hashedTransferPin = await bcrypt.hash(user.transferPin, 10)

      const created = await User.create({
        ...user,
        password: hashedPassword,
        loginPin: hashedLoginPin,
        transferPin: hashedTransferPin,
      })

      createdUsers.push(created)
    }


    console.log('  Database seeded successfully!')
    process.exit()
  } catch (err) {
    console.log(' Seed error:', err)
    process.exit(1)
  }
}

run()