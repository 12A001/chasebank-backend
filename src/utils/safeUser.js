export const safeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  username: user.username,
  accountNumber: user.accountNumber,
  phone: user.phone,
  address: user.address,
  birthday: user.birthday,
  balance: user.balance,
})