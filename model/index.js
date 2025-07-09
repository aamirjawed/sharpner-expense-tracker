const User = require('./userModel')
const Expense = require('./expenseModel');
const Payment = require('./paymentModel');
const ForgotPassword = require('./forgotPasswordModel');


User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'userId' });


User.belongsTo(Payment, {foreignKey:'userId', onDelete:'CASCADE'})
Payment.belongsTo(User, {foreignKey:'userId'})

User.hasMany(ForgotPassword, {foreignKey:'userId', onDelete:'CASCADE'})
ForgotPassword.belongsTo(User, {foreignKey:'userId'})


module.exports = {User, Expense, Payment}